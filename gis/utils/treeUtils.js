/**
 * 对Ztree.js的封装.提供基本的初始化Ztree
 * 依赖于jQuery、lodash
 * 基本的用法参见views/xtch/js/xtch.js
 */
var TreeUtils =(function(window,$,_){

    function Tree(){};

    function zTreeOnClick(event, treeId, treeNode) {
        if(treeNode.isParent){
            return false;
        }

        var usercodeToAdd = treeNode.code,
            usernameToAdd = treeNode.name;

        var domId = _.trimEnd(treeId,"Tree");//<span class="glyphicon glyphicon-remove-sign" aria-hidden="true"></span>
        if(window.treeType==2)domId='editPage';

        if(window.treeType==3){
            var userDiv = $('#'+domId).find('div.reporterSelect3');
            var usercodeInput = $(userDiv).parent().find('input[data-name="usercode3"]');
            var usernameInput = $(userDiv).parent().find('input[data-name="username3"]');
        }else{
            var userDiv = $('#'+domId).find('div.reporterSelect');
            var usercodeInput = $(userDiv).parent().find('input[data-name="usercode"]');
            var usernameInput = $(userDiv).parent().find('input[data-name="username"]');
        }
        if(userDiv.length == 0){
            return false;
        }

        var usercodes = usercodeInput.val().split(','),
            usernames = usernameInput.val().split(',');
        _.remove(usercodes, function(n) {
            return n === "";
        });
        _.remove(usernames, function(n) {
            return n === "";
        });
        if(usercodes.indexOf(usercodeToAdd) != -1){
            //说明已存在,不继续添加
            return false;
        }

        if(usercodes.length >= 1){
            //超出一人
            usercodes.splice(0,usercodes.length);
            usernames.splice(0,usernames.length);
        }
        //说明不存在。可添加
        usercodes.push(usercodeToAdd);
        usernames.push(usernameToAdd);

        var html = '<span id="'+usercodeToAdd+','+usernameToAdd+'">'+usernameToAdd+'&nbsp;<i class="fa fa-times-circle" aria-hidden="true"></i></span>'
        userDiv.empty().append(html);
        userDiv.trigger('childchanged');
        usercodeInput.val(_.trim(usercodes.join(','),','));
        usernameInput.val(_.trim(usernames.join(','),','));
    };

    window.token = localStorage.getItem("readToken");
    window.siteCode = localStorage.getItem("readSiteCode");
    Tree.prototype={
        zNodes: [],
        zTree:null,
        lastValue:"",
        setting: {
            async: {
                enable: true,
                url:window.config.projectTppRestName+'auth/depart?token='+window.token+'&siteCode='+window.siteCode,
                type:'GET',
                autoParam:["code=departCode"],
            },
            //data: {
            //    simpleData: {
            //        enable: true
            //    }
            //},
            view: {
                showIcon: false
            },
            callback: {
                onClick: zTreeOnClick
            }
        },
        init: function($_dom){
            var _this = this;
            $.ajax({
                type: 'GET',
                url: window.config.projectTppRestName+'auth/depart?token='+window.token+'&siteCode='+window.siteCode,
                dataType:'json',
                success: function(response){
                    if(response){
                        _this.zNodes = response;
                        if(_this.zNodes.length == 0){
                            $_dom.append('<li style="text-align: center;color: #fdf59a;">人员树获取错误!</li>');
                            return;
                        }
                        _this.zTree = $.fn.zTree.init($_dom, _this.setting, _this.zNodes);
                        _this.expandRootNode(_this.zTree);
                    }
                },
                error:function(jqXHR,textStatus,errorThrown){
                    console.log(errorThrown);
                }
            });
        },
        buildTree: function($_dom,type){
            this.zNodes = [];
            if(type){
                window.treeType = type;
            }else{
                window.treeType = false;
            }
            if(this.zNodes.length == 0){
                this.init($_dom);
            }else{
                _this.zTree = $.fn.zTree.init($_dom, this.setting, this.zNodes);
                _this.expandRootNode(_this.zTree);
            }
            return this;
        },
        queryByParamFuzzy: function(value){
            var _this = this;
            if(_this.zTree){
                var nodes = _this.zTree.getNodesByParamFuzzy("name", "value", null);
            }
        },
        bindSearchEvent: function(obj){
            var _this = this;
            var obj = obj || {dom:'',keyType:'name'};
            var $_dom = obj.dom;
            obj._this = _this;
            $_dom.bind("focus",obj,_this.focusKey)
                .bind("blur",obj, _this.blurKey)
                .bind("propertychange",obj, _this.searchNode)
                .bind("input",obj, _this.searchNode);
        },
        focusKey: function(e){
            var key = e.data.dom;
            if (key.hasClass("empty")) {
                key.removeClass("empty");
            }
        },
        blurKey: function(e){
            var key = e.data.dom;
            if (key.get(0).value === "") {
                key.addClass("empty");
            }
        },
        searchNode: function(e){
            var _this = e.data._this,
                key = e.data.dom,
                keyType = e.data.keyType;
            var nodeList = [],
                latestValue = _this.lastValue,
                value = $.trim(key.get(0).value);
            var zTree = _this.zTree;

            if (key.hasClass("empty")) {
                value = "";
            }
            if (latestValue === value) return;

            _this.lastValue = latestValue = value;
            if (value === ""){
                //var nodes = zTree.getNodeByParam();
                //zTree.showNodes(nodes);
                _this.expandRootNode(zTree);
                return;
            };
            //_this.hideNodes(false);

            nodeList = zTree.getNodesByParamFuzzy(keyType, value);

            _this.hideNodes(nodeList);

        },
        expandRootNode: function(zTree){
            //获取根节点
            zTree.expandAll(false);
            var nodes = zTree.getNodesByParam("isHidden", true);;
            zTree.showNodes(nodes);
            var rootNodes = zTree.getNodesByParam("pId", null);
            if(rootNodes.length === 1){
                zTree.expandNode(rootNodes[0], true, false, false,false);
            }
        },
        hideNodes: function(nodeList){
            var zTree = this.zTree;
            var _this = this;
            var nodes = zTree.getNodesByParam("isHidden", false);
            zTree.hideNodes(nodes);
            _(nodeList).forEach(function(node) {
                var path = node.getPath();
                var rootChild = _.filter(path,function(o){return !o.isParent;});
                if(rootChild.length > 0){
                    _this.showPath(path,false);
                }else{
                    _this.showPath(path,true);

                }
                //_this.showParentNode(node,true);
            });


        },
        showPath: function(path,flag){
            var zTree = this.zTree;

            if(path.length == 1){
                //说明是搜寻结果是一级部门
                zTree.showNode(path[0]);
                var childs = path[0].children;
                zTree.showNodes(childs);
                zTree.expandNode(path[0], true, false, false);
            }else{
                _(path).forEach(function(node){
                    zTree.showNode(node);
                    zTree.expandNode(node, true, false, false);
                    var parent = node.getParentNode();
                    if(flag && node.isParent && parent){
                        var childs = node.children;
                        zTree.showNodes(childs);
                    }
                });
            }
        }

    };

    if ( typeof define === "function" && define.amd ) {
        define("tree", [], function() {
            return new Tree();
        });
    }

    return new Tree();

})(window,jQuery,_);