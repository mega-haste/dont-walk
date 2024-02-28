
EXPORT="Don't-walk"
BP_EXPORT="/sdcard/Android/data/com.mojang.minecraftpe.patch/files/games/com.mojang/development_behavior_packs/"
RP_EXPORT="/sdcard/Android/data/com.mojang.minecraftpe.patch/files/games/com.mojang/development_resource_packs/"

rm -rdf "$BP_EXPORT/$EXPORT" "$RP_EXPORT/$EXPORT"

# mkdir $EXPORT 
mkdir "$BP_EXPORT/$EXPORT"
mkdir "$RP_EXPORT/$EXPORT"
cp -r BP "$BP_EXPORT/$EXPORT/"
cp -r RP "$RP_EXPORT/$EXPORT/"

zip -r "$EXPORT.mcaddon" BP/ RP/

