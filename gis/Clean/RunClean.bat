@echo off

::����ע���
echo ��ʼ����ע���...
reg import "cleanReg.reg"

::��ѯIE���õ�ActiveXCacheĿ¼
for /f "delims=" %%i in ('reg.exe query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Internet Settings" /V "ActiveXCache"') do set ActiveXCacheDir="%%i"
set ActiveXCacheDir=%ActiveXCacheDir:~31,-1%

::����inf�ļ�
echo ��ʼ����inf�ļ�...
if exist "%ActiveXCacheDir%\iLiveSDK.inf" del "%ActiveXCacheDir%\iLiveSDK.inf" /f /s /q
if exist "%ActiveXCacheDir%\iLiveSDK_activex.inf" del "%ActiveXCacheDir%\iLiveSDK_activex.inf" /f /s /q
if exist "%ActiveXCacheDir%\WXVoiceSDK.inf" del "%ActiveXCacheDir%\WXVoiceSDK.inf" /f /s /q
if exist "%ActiveXCacheDir%\WXVoiceSDK_activex.inf" del "%ActiveXCacheDir%\WXVoiceSDK_activex.inf" /f /s /q

::����iLiveSDK��dll�ļ�
echo ��ʼ����iLiveSDK�ļ�...
if exist %APPDATA%\Tencent\iLiveSDK_activex rmdir %APPDATA%\Tencent\iLiveSDK_activex /s /q
if exist %APPDATA%\Tencent\iLiveSDK rmdir %APPDATA%\Tencent\iLiveSDK /s /q

::����WXVoiceSDK��dll�ļ�
echo ��ʼ����WXVoiceSDK�ļ�...
if exist %APPDATA%\Tencent\WXVoiceSDK_activex rmdir %APPDATA%\Tencent\WXVoiceSDK_activex /s /q
if exist %APPDATA%\Tencent\WXVoiceSDK rmdir %APPDATA%\Tencent\WXVoiceSDK /s /q

pause
::echo ִ����ɣ���������˳�...
::pause>nul

