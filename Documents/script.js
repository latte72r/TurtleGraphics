
/* (c) 2022-2024 Ryo Fujinami.*/

let headerHight;
let canvasWidth;
let canvasHeight;
$(window).on("load resize", function () {
    let breakpoint = 1024;
    let browseWid = $(window).width();
    let widSp = browseWid < breakpoint; //SP表示
    if (widSp) {
        // スマートフォン
        headerHight = 145;
        canvasWidth = browseWid * 0.76;
        canvasHeight = 600;
    } else {
        // PC
        headerHight = 110;
        canvasWidth = browseWid * 0.78;
        canvasHeight = 600;
    }
});
// .accordion_one
$(function () {
    //.accordion_oneの中の.accordion_headerがクリックされたら
    $('.accordion_one .accordion_header').click(function () {
        //クリックされた.accordion_oneの中の.accordion_headerに隣接する.accordion_innerが開いたり閉じたりする。
        $(this).next('.accordion_inner').slideToggle();
        $(this).toggleClass("open");
    });
});
