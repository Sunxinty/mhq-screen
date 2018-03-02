// 定义构造函数
function createNode(data,next) {
    var obj = {
        data: data,
        next: next
    };
    return obj;
}
// 定义链表函数
function CircularLinkedList() {
    this.pRear = null;
    this.length = 0;
    this.InsertAtEnd = function (data) {
        if (this.length == 0) {
            var node = new createNode(data,this.pRear);
            this.pRear = node;
            node.next = this.pRear;
        } else {
            var node = new createNode(data,this.pRear.next);
            this.pRear.next = node;
            this.pRear = node;
        }
        this.length++;
    }
    this.InsertAtFirst = function (data) {
        if (this.length == 0) {
            var node = new createNode(data,this.pRear);
            this.pRear = node;
            node.next = this.pRear;
        } else {
            var node = new createNode(data,this.pRear.next);
            this.pRear.next = node;
        }
        this.length++;
    }
    this.Locate = function (index) {
        if (index < 0 || index > this.length - 1) {
            throw new Error("索引值有错");
        }   
        var temp = this.pRear.next;             
        for (var i = 0; i < index; i++) {
            temp = temp.next;
        }
        return temp;
    }
    this.Insert = function (index,data) {
        if (index < 0 || index > this.length) {
            throw new Error("索引值有错");
        }
        if (index == 0) {
            this.InsertAtFirst(data);
        } else if (index == this.length) {
            this.InsertAtEnd(data);
        } else {
            var node = new createNode(data,this.Locate(index));
            this.Locate(index - 1).next = node;
            this.length++;
        }
    }
    this.Search = function (data) {
        var temp = this.pRear.next;
        for (var i = 0; i < this.length; i++) {
            if (data == temp.data) {
                return i;
            }
            temp = temp.next;
        }
        return -1;
    }
    this.Clear = function () {
        this.length = 0;
        this.pRear = null;
    }
    this.Remove = function (index) {
        if (index < 0 || index > this.length - 1 || this.length == 0) {
            throw new Error("索引值有错");
        }
        if (this.length == 1) {
            this.Clear();
            return 1;
        }
        if (index == 0) {
            this.pRear.next = this.Locate(0).next;
        } else {
            this.Locate(index - 1).next = this.Locate(index).next;
        }
    }
    this.isEmpty = function () {
        return this.length == 0 ? true : false;
    }
    this.toString = function () {
        var temp = this.pRear.next,
            str = "";
        for (var i = 0; i < this.length; i++) {
            str += "第" + i + "个为:" + temp.data; 
            temp = temp.next; 
        }
        return str;
    }
}