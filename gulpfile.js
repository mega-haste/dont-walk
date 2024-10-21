import { dest, series, src, watch } from "gulp";
import webpackGulp from "webpack-stream";

import webpackConfig from "./webpack.config.cjs";

import bedrox from "./bedrox.js";
import GulpZip from "gulp-zip";
import gulpCopy from "gulp-copy";

export function buildDev() {
    return src("src/**/*.ts")
        .pipe(
            webpackGulp(webpackConfig),
        )
        .pipe(dest("./BP/scripts/"));
}

export function exportBP() {
    return src("BP/**")
        .pipe(GulpZip(`${bedrox.name}.bp.mcpack`))
        .pipe(dest(bedrox.dest));
}

export function exportRP() {
    return src("RP/**")
        .pipe(GulpZip(`${bedrox.name}.rp.mcpack`))
        .pipe(dest(bedrox.dest));
}

export function exportAddon() {
    return src([`${bedrox.dest}/${bedrox.name}.bp.mcpack`, `${bedrox.dest}/${bedrox.name}.rp.mcpack`])
        .pipe(GulpZip(`${bedrox.name}.mcaddon`))
        .pipe(dest(bedrox.dest));
}

export function exportBPDev() {
    return src(`BP/**`)
        .pipe(
            gulpCopy(
                `${bedrox.root}/development_behavior_packs/${bedrox.name}`,
            ),
        )
        .resume();
}

export function exportRPDev() {
    return src("RP/**")
        .pipe(
            gulpCopy(
                `${bedrox.root}/development_resource_packs/${bedrox.name}`,
            ),
        )
        .resume();
}

export default function () {
    watch(
        ["src/**/*.ts", "BP/**", "!BP/scripts/**", "RP/**"],
        { ignoreInitial: false },
        series(
            buildDev,
            exportBP,
            exportRP,
            exportAddon,
            exportBPDev,
            exportRPDev,
        ),
    );
}
