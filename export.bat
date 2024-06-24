@echo off

set "EXPORT=Don't-walk"
set "BP_EXPORT=C:\Users\Dell\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_behavior_packs"
set "RP_EXPORT=C:\Users\Dell\AppData\Local\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\development_resource_packs"

rd /s /q "%BP_EXPORT%\%EXPORT%"
rd /s /q "%RP_EXPORT%\%EXPORT%"

mkdir "%BP_EXPORT%\%EXPORT%"
mkdir "%RP_EXPORT%\%EXPORT%"
xcopy /s "BP" "%BP_EXPORT%\%EXPORT%"
xcopy /s "RP" "%RP_EXPORT%\%EXPORT%"

rem Replace 'zip' with your preferred archiving tool if it's not recognized
rem Make sure to adjust the path to your archiving tool if necessary
7z a "%EXPORT%.mcaddon" "BP\" "RP\"

