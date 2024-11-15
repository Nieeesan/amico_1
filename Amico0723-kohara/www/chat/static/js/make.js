// エージェント画像指定
var agentImgBase64 = "./img/my_photo.jpg",
  //   agentImgX = "224",
  //   agentImgY = "199",
  //   agentImgRotate = "0.01",
  //   agentImgScale = "1.73";

  // // 目・口の位置の座標
  // var agentFaceEyeLeftL = "38.35",
  //   agentFaceEyeRightL = "69.04",
  //   agentFaceEyeLeftT = "44.45",
  //   agentFaceEyeRightT = "46.55",
  //   agentFaceMouthLeftL = "45.11",
  //   agentFaceMouthLeftT = "68.39",
  //   agentFaceMouthCenterL = "52.30",
  //   agentFaceMouthCenterT = "68.83",
  //   agentFaceMouthRightL = "59.51",

  agentImgX = "-100", // 画像のX座標調整
  agentImgY = "50", // 画像のY座標調整
  agentImgRotate = "0", // 画像の回転
  agentImgScale = "1"; // 画像の拡大比率

// 目・口の位置の座標
// 左目のX座標
var agentFaceEyeLeftL = "36",
  // 右目のX座標
  agentFaceEyeRightL = "67",
  // 左目のY座標
  agentFaceEyeLeftT = "47",
  // 右目のY座標
  agentFaceEyeRightT = "47",
  // 口の左端のX座標
  agentFaceMouthLeftL = "42",
  // 口の中央のX座標
  agentFaceMouthCenterL = "50",
  // 口の右端のX座標
  agentFaceMouthRightL = "62",
  // 口の左端のY座標
  agentFaceMouthLeftT = "63",
  // 口の中央のY座標
  agentFaceMouthCenterT = "65",
  // 口の右端のY座標
  agentFaceMouthRightT = "63";

var agentImgFace = {
  userName: "userName",
  sensorId: "sensorId",
  agentImg: {
    base64: agentImgBase64,
    x: agentImgX,
    y: agentImgY,
    rotate: agentImgRotate,
    scale: agentImgScale,
  },
  agentFace: {
    eyeLeft: [agentFaceEyeLeftL, agentFaceEyeLeftT],
    eyeRight: [agentFaceEyeRightL, agentFaceEyeRightT],
    mouthLeft: [agentFaceMouthLeftL, agentFaceMouthLeftT],
    mouthCenter: [agentFaceMouthCenterL, agentFaceMouthCenterT],
    mouthRight: [agentFaceMouthRightL, agentFaceMouthRightT],
  },
  time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
};

var setStart = 13;
var rhy = setStart,
  textLength = 0,
  agentCs = "";

var finishedNum = 0;

var face_img_width,
  face_img_height,
  desktop_base_scale,
  desktop_base_scale_dist,
  desktop_base_rotate,
  desktop_base_rotate_angle,
  marker_data,
  face_img_offsetX = 0,
  face_img_offsetY = 0,
  face_img_scale = 1,
  face_img_rotate = 0,
  base_img_offsetX = 384;

var make_canvas, zoomed_canvas, scale_and_rotate_desktop, face_img;

var toStopNum = 0,
  moveLNum = 0;

var currentTouches = [];

checkDefaultExist();

function giveAgentCs(aCS) {
  agentCs = aCS;
  textLength = 0;
}

function resetAgentImgFace(agentImgFaceAll) {
  agentImgBase64 = agentImgFaceAll.agentImg.base64;
  agentImgX = agentImgFaceAll.agentImg.x;
  agentImgY = agentImgFaceAll.agentImg.y;
  agentImgRotate = agentImgFaceAll.agentImg.rotate;
  agentImgScale = agentImgFaceAll.agentImg.scale;
  agentFaceEyeLeftL = agentImgFaceAll.agentFace.eyeLeft[0];
  agentFaceEyeLeftT = agentImgFaceAll.agentFace.eyeLeft[1];
  agentFaceEyeRightL = agentImgFaceAll.agentFace.eyeRight[0];
  agentFaceEyeRightT = agentImgFaceAll.agentFace.eyeRight[1];
  agentFaceMouthLeftL = agentImgFaceAll.agentFace.mouthLeft[0];
  agentFaceMouthLeftT = agentImgFaceAll.agentFace.mouthLeft[1];
  agentFaceMouthCenterL = agentImgFaceAll.agentFace.mouthCenter[0];
  agentFaceMouthCenterT = agentImgFaceAll.agentFace.mouthCenter[1];
  agentFaceMouthRightL = agentImgFaceAll.agentFace.mouthRight[0];
  agentFaceMouthRightT = agentImgFaceAll.agentFace.mouthRight[1];
  startModule();
}

function startModule() {
  !(function (t) {
    function e(t, e) {
      if (!(t.originalEvent.touches.length > 1)) {
        t.preventDefault();
        var a = t.originalEvent.changedTouches[0],
          o = document.createEvent("MouseEvents");
        o.initMouseEvent(
          e,
          !0,
          !0,
          window,
          1,
          a.screenX,
          a.screenY,
          a.clientX,
          a.clientY,
          !1,
          !1,
          !1,
          !1,
          0,
          null
        ),
          t.target.dispatchEvent(o);
      }
    }
    if (((t.support.touch = "ontouchend" in document), t.support.touch)) {
      var a,
        o = t.ui.mouse.prototype,
        i = o._mouseInit,
        n = o._mouseDestroy;
      (o._touchStart = function (t) {
        !a &&
          this._mouseCapture(t.originalEvent.changedTouches[0]) &&
          ((a = !0),
          (this._touchMoved = !1),
          e(t, "mouseover"),
          e(t, "mousemove"),
          e(t, "mousedown"));
      }),
        (o._touchMove = function (t) {
          a && ((this._touchMoved = !0), e(t, "mousemove"));
        }),
        (o._touchEnd = function (t) {
          a &&
            (e(t, "mouseup"),
            e(t, "mouseout"),
            this._touchMoved || e(t, "click"),
            (a = !1));
        }),
        (o._mouseInit = function () {
          this.element.bind({
            touchstart: t.proxy(this, "_touchStart"),
            touchmove: t.proxy(this, "_touchMove"),
            touchend: t.proxy(this, "_touchEnd"),
          }),
            i.call(this);
        }),
        (o._mouseDestroy = function () {
          this.element.unbind({
            touchstart: t.proxy(this, "_touchStart"),
            touchmove: t.proxy(this, "_touchMove"),
            touchend: t.proxy(this, "_touchEnd"),
          }),
            n.call(this);
        });
    }
  })(jQuery);

  $(window).load(function () {}),
    $(window).ready(function () {
      (face_img = document.getElementById("face-image")),
        (make_canvas = document.getElementById("make-canvas")),
        (zoomed_canvas = document.getElementById("zoomed-canvas")),
        (scale_and_rotate_desktop = document.getElementById(
          "scale-and-rotate-desktop"
        )),
        11 == window.location.search.length
          ? startNodding(window.location.search.substring(1, 11))
          : $("#import-image").change(importImage),
        positionWrap();
    }),
    $(window).resize(positionWrap);

  function positionWrap() {
    (height = $(window).height()),
      height < 500 && (height = 500),
      (width = 0.75 * (height - 38)),
      width > $(window).width() &&
        ((width = $(window).width()), (height = width / 0.75 + 38)),
      $("#main-wrap").css({
        width: width,
        height: height,
      });
  }

  $(window).ready(function () {
    importDefaultImage(),
      $("#inputNewImage").click(function (t) {
        document.getElementById("import-image").click(),
          $("#instruction-1").text(labels[lang].move_photo),
          t.preventDefault();
      }),
      $("#page-02-transform-image input.next").click(function (t) {
        $("#page-02-transform-image").hide(400),
          $("#page-03-mark-image").show(400),
          drawMouth(),
          $("#instruction-1").text(labels[lang].mark),
          t.preventDefault();
      }),
      $("#page-03-mark-image input.back").click(function (t) {
        $("#page-02-transform-image").show(400),
          $("#page-03-mark-image").hide(400),
          drawImage(),
          $("#instruction-1").text(labels[lang].move_photo),
          t.preventDefault();
      }),
      $("#page-03-mark-image input.next").click(function (t) {
        drawImage(),
          (marker_data = markerData()),
          nod_init(make_canvas.toDataURL("image/jpeg"), marker_data),
          $("#page-02-03-make").hide(0),
          $("#page-04-nod").show(0),
          t.preventDefault();
      }),
      $("#page-04-nod input.back").click(function (t) {
        $("#page-02-03-make").show(0),
          $("#page-04-nod").hide(0),
          clearInterval(at),
          t.preventDefault();
      }),
      $("#page-04-nod input.next").click(function (t) {
        $(".name-dialog").css("display", "block"),
          $("#name-input").focus(),
          drawImage(),
          (marker_data = markerData()),
          nod_init(make_canvas.toDataURL("image/jpeg"), marker_data),
          $("#page-02-03-make").hide(0),
          $("#page-04-nod").show(0),
          t.preventDefault();
      }),
      $("#page-04-nod input.next-2").click(function (t) {
        $(this).val(labels[lang].saving),
          $(this).css("pointer-events", "none"),
          storeData(),
          t.preventDefault();
      });
  });

  $(window).ready(function () {
    "ontouchstart" in document.documentElement &&
      (make_canvas.addEventListener("touchstart", touchStart, !0),
      make_canvas.addEventListener("touchend", touchEnd, !0),
      make_canvas.addEventListener("touchmove", touchMove, !0)),
      make_canvas.addEventListener("mousedown", touchMouseDown, !0),
      make_canvas.addEventListener("mouseup", touchMouseEnd, !0),
      make_canvas.addEventListener("mousemove", touchMouseMove, !0),
      $("#page-02-transform-image #scale-and-rotate-desktop").draggable({
        start: function () {
          (desktop_base_scale = face_img_scale),
            (desktop_base_scale_dist = Math.sqrt(
              Math.pow(
                $(scale_and_rotate_desktop).position().left -
                  $(make_canvas).width() / 2,
                2
              ) +
                Math.pow(
                  $(scale_and_rotate_desktop).position().top -
                    $(make_canvas).height() / 2,
                  2
                )
            )),
            (desktop_base_rotate = face_img_rotate),
            (desktop_base_rotate_angle = Math.atan(
              ($(scale_and_rotate_desktop).position().top -
                $(make_canvas).height() / 2) /
                ($(scale_and_rotate_desktop).position().left -
                  $(make_canvas).width() / 2)
            ));
        },
        drag: function () {
          var t = Math.sqrt(
            Math.pow(
              $(scale_and_rotate_desktop).position().left -
                $(make_canvas).width() / 2,
              2
            ) +
              Math.pow(
                $(scale_and_rotate_desktop).position().top -
                  $(make_canvas).height() / 2,
                2
              )
          );
          var e = Math.atan(
            ($(scale_and_rotate_desktop).position().top -
              $(make_canvas).height() / 2) /
              ($(scale_and_rotate_desktop).position().left -
                $(make_canvas).width() / 2)
          );
          $(scale_and_rotate_desktop).position().left -
            $(make_canvas).width() / 2 <
            0 && (e += Math.PI),
            (face_img_rotate =
              desktop_base_rotate + e - desktop_base_rotate_angle),
            (face_img_scale = 2 * e),
            (face_img_offsetX = t),
            (face_img_offsetY = t),
            drawImage();
        },
      });
  });

  function importImage() {
    $("#page-02-03-make").show();
    var t = $(this);
    console.log(t);
    if (t.is("input")) {
      var e = t.prop("files")[0],
        a = new FileReader();
      var type = e.type; //image/jpeg
      var size = e.size;
      var tp = type.split("/")[0];
      console.log(tp);
      console.log(size);
      if (tp != "image" || size > 1 * 1024 * 1024) {
        alert("1MB以内の画像！");
        return false;
      } else {
        (a.onload = function (t) {
          face_img.src = t.target.result;
          agentImgBase64 = t.target.result;
          agentImgFace = {
            userName: "userName",
            sensorId: "sensorId",
            agentImg: {
              base64: agentImgBase64,
              x: agentImgX,
              y: agentImgY,
              rotate: agentImgRotate,
              scale: agentImgScale,
            },
            agentFace: {
              eyeLeft: [agentFaceEyeLeftL, agentFaceEyeLeftT],
              eyeRight: [agentFaceEyeRightL, agentFaceEyeRightT],
              mouthLeft: [agentFaceMouthLeftL, agentFaceMouthLeftT],
              mouthCenter: [agentFaceMouthCenterL, agentFaceMouthCenterT],
              mouthRight: [agentFaceMouthRightL, agentFaceMouthRightT],
            },
            time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
          };
        }),
          (a.onloadend = function (t) {
            var e = EXIF.readFromBinaryFile(base64ToArrayBuffer(this.result));
            if (void 0 != e.Orientation && 0 != e.Orientation) {
              make_canvas.getContext("2d");
              switch (e.Orientation) {
                case 1:
                  face_img_rotate = 0;
                  break;
                case 2:
                  break;
                case 3:
                  face_img_rotate = Math.PI;
                  break;
                case 4:
                  break;
                case 5:
                case 6:
                case 7:
                  face_img_rotate = 0.5 * Math.PI;
                  break;
                case 8:
                  face_img_rotate = -0.5 * Math.PI;
              }
            }
          }),
          a.readAsDataURL(e);
      }
      face_img.onload = function (t) {
        (face_img_width = face_img.width),
          (face_img_height = face_img.height),
          (face_img_width *= 1024 / face_img_height),
          (face_img_height = 1024),
          drawImage();
      };
      face_img.onerror = function () {
        alert("画像を読み込めない！");
        console.clear();
      };
    }
  }

  function importDefaultImage() {
    $("#page-02-03-make").show();
    face_img.src = agentImgBase64;
    face_img_offsetX = agentImgX; //画像の横移動
    face_img_offsetY = agentImgY; //画像の縦移動
    face_img_rotate = agentImgRotate; //画像の回転
    face_img_scale = agentImgScale; //画像の拡大縮小
    face_img.onload = function (t) {
      (face_img_width = face_img.width),
        (face_img_height = face_img.height),
        (face_img_width *= 1024 / face_img_height),
        (face_img_height = 1024),
        drawImage();
    };
    face_img.onerror = function () {
      alert("画像を読み込めない！");
      console.clear();
    };
  }

  function base64ToArrayBuffer(t) {
    t = t.replace(/^data\:([^\;]+)\;base64,/gim, "");
    for (
      var e = atob(t), a = e.length, o = new Uint8Array(a), i = 0;
      i < a;
      i++
    )
      o[i] = e.charCodeAt(i);
    return o.buffer;
  }

  function drawImage() {
    var t = make_canvas.getContext("2d");
    t.clearRect(0, 0, 768, 1024);
    t.save(),
      t.translate(face_img_offsetX, face_img_offsetY),
      t.translate(base_img_offsetX, 512),
      t.scale(face_img_scale, face_img_scale),
      t.rotate(face_img_rotate),
      t.drawImage(
        face_img,
        -base_img_offsetX,
        -512,
        face_img_width,
        face_img_height
      ),
      t.restore();
  }

  function touchStart(e) {
    for (t = 0; t < e.changedTouches.length; t++) {
      var a = e.changedTouches.item(t);
      currentTouches.push({
        identifier: a.identifier,
        clientX: a.clientX,
        clientY: a.clientY,
      });
    }
    e.preventDefault();
  }

  function touchMouseDown(t) {
    currentTouches.push({
      clientX: t.clientX,
      clientY: t.clientY,
    }),
      t.preventDefault();
  }

  function touchEnd(e) {
    for (t = 0; t < e.changedTouches.length; t++) {
      var a = e.changedTouches.item(t);
      for (ct = 0; ct < currentTouches.length; ct++)
        currentTouches[ct].identifier == a.identifier &&
          currentTouches.splice(ct, 1);
    }
    e.preventDefault();
  }

  function touchMouseEnd(t) {
    (currentTouches = []), t.preventDefault();
  }

  function touchMove(e) {
    for (ct = 0; ct < currentTouches.length; ct++)
      for (t = 0; t < e.targetTouches.length; t++) {
        var a = e.targetTouches.item(t);
        if (currentTouches[ct].identifier == a.identifier)
          if (0 == ct) {
            var o = (768 / $(make_canvas).width()) * 0.9;
            (face_img_offsetX += o * (a.clientX - currentTouches[0].clientX)),
              (face_img_offsetY += o * (a.clientY - currentTouches[0].clientY));
            var i = a.clientX,
              n = a.clientY;
          } else if (1 == ct) {
            var s = Math.hypot(
                currentTouches[0].clientX - currentTouches[1].clientX,
                currentTouches[0].clientY - currentTouches[1].clientY
              ),
              c = Math.hypot(i - a.clientX, n - a.clientY);
            face_img_scale *= Math.sqrt(c / s);
            var r = Math.atan(
                (currentTouches[0].clientY - currentTouches[1].clientY) /
                  (currentTouches[0].clientX - currentTouches[1].clientX)
              ),
              h = Math.atan((n - a.clientY) / (i - a.clientX));
            Math.abs(h - r) < 1 && (face_img_rotate += 0.9 * (h - r));
          }
      }
    for (drawImage(), ct = 0; ct < currentTouches.length; ct++)
      for (t = 0; t < e.targetTouches.length; t++) {
        a = e.targetTouches.item(t);
        currentTouches[ct].identifier == a.identifier &&
          ((currentTouches[ct].clientX = a.clientX),
          (currentTouches[ct].clientY = a.clientY));
      }
    e.preventDefault();
  }

  function touchMouseMove(t) {
    for (ct = 0; ct < currentTouches.length; ct++)
      0 == ct &&
        ((face_img_offsetX += t.clientX - currentTouches[0].clientX),
        (face_img_offsetY += t.clientY - currentTouches[0].clientY));
    for (drawImage(), ct = 0; ct < currentTouches.length; ct++)
      (currentTouches[ct].clientX = t.clientX),
        (currentTouches[ct].clientY = t.clientY);
    t.preventDefault();
  }

  $(window).ready(function () {
    var t = [0, 0, 0, 0];
    document
      .getElementById("eyeLeft")
      .setAttribute(
        "style",
        "left: " + agentFaceEyeLeftL + "%; top: " + agentFaceEyeLeftT + "%;"
      ),
      document
        .getElementById("eyeRight")
        .setAttribute(
          "style",
          "left: " + agentFaceEyeRightL + "%; top: " + agentFaceEyeRightT + "%;"
        ),
      document
        .getElementById("mouthLeft")
        .setAttribute(
          "style",
          "left: " +
            agentFaceMouthLeftL +
            "%; top: " +
            agentFaceMouthLeftT +
            "%;"
        ),
      document
        .getElementById("mouthCenter")
        .setAttribute(
          "style",
          "left: " +
            agentFaceMouthCenterL +
            "%; top: " +
            agentFaceMouthCenterT +
            "%;"
        ),
      document
        .getElementById("mouthRight")
        .setAttribute(
          "style",
          "left: " +
            agentFaceMouthRightL +
            "%; top: " +
            agentFaceMouthRightT +
            "%;"
        ),
      $("#page-03-mark-image .markers div").draggable({
        start: function () {
          $(this).css("opacity", 0.33),
            $(this).hasClass("mouth") &&
              $(this).hasClass("center") &&
              ((t[0] =
                $(".mouth.left").position().left - $(this).position().left),
              (t[1] = $(".mouth.left").position().top - $(this).position().top),
              (t[2] =
                $(".mouth.right").position().left - $(this).position().left),
              (t[3] =
                $(".mouth.right").position().top - $(this).position().top)),
            $(this).hasClass("mouth") && $(".mouth").css("opacity", 0.33);
        },
        drag: function (e) {
          $(this).hasClass("mouth") &&
            $(this).hasClass("center") &&
            ($(".mouth.left").css("left", $(this).position().left + t[0]),
            $(".mouth.left").css("top", $(this).position().top + t[1]),
            $(".mouth.right").css("left", $(this).position().left + t[2]),
            $(".mouth.right").css("top", $(this).position().top + t[3])),
            drawMouth(),
            drawZoomed(this);
        },
        stop: function () {
          var clientW = document.getElementById("markers").clientWidth;
          var clientH = document.getElementById("markers").clientHeight;
          var agentFaceEyeLeftL_ = (
            (Number(
              document.getElementById("eyeLeft").style.left.replace("px", "")
            ) /
              clientW) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceEyeLeftT_ = (
            (Number(
              document.getElementById("eyeLeft").style.top.replace("px", "")
            ) /
              clientH) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceEyeRightL_ = (
            (Number(
              document.getElementById("eyeRight").style.left.replace("px", "")
            ) /
              clientW) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceEyeRightT_ = (
            (Number(
              document.getElementById("eyeRight").style.top.replace("px", "")
            ) /
              clientH) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthLeftL_ = (
            (Number(
              document.getElementById("mouthLeft").style.left.replace("px", "")
            ) /
              clientW) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthLeftT_ = (
            (Number(
              document.getElementById("mouthLeft").style.top.replace("px", "")
            ) /
              clientH) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthCenterL_ = (
            (Number(
              document
                .getElementById("mouthCenter")
                .style.left.replace("px", "")
            ) /
              clientW) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthCenterT_ = (
            (Number(
              document.getElementById("mouthCenter").style.top.replace("px", "")
            ) /
              clientH) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthRightL_ = (
            (Number(
              document.getElementById("mouthRight").style.left.replace("px", "")
            ) /
              clientW) *
            100
          )
            .toFixed(2)
            .toString();
          var agentFaceMouthRightT_ = (
            (Number(
              document.getElementById("mouthRight").style.top.replace("px", "")
            ) /
              clientH) *
            100
          )
            .toFixed(2)
            .toString();
          if (agentFaceEyeLeftL_ != "NaN") {
            agentFaceEyeLeftL = agentFaceEyeLeftL_;
          }
          if (agentFaceEyeLeftT_ != "NaN") {
            agentFaceEyeLeftT = agentFaceEyeLeftT_;
          }
          if (agentFaceEyeRightL_ != "NaN") {
            agentFaceEyeRightL = agentFaceEyeRightL_;
          }
          if (agentFaceEyeRightT_ != "NaN") {
            agentFaceEyeRightT = agentFaceEyeRightT_;
          }
          if (agentFaceMouthLeftL_ != "NaN") {
            agentFaceMouthLeftL = agentFaceMouthLeftL_;
          }
          if (agentFaceMouthLeftT_ != "NaN") {
            agentFaceMouthLeftT = agentFaceMouthLeftT_;
          }
          if (agentFaceMouthCenterL_ != "NaN") {
            agentFaceMouthCenterL = agentFaceMouthCenterL_;
          }
          if (agentFaceMouthCenterT_ != "NaN") {
            agentFaceMouthCenterT = agentFaceMouthCenterT_;
          }
          if (agentFaceMouthRightL_ != "NaN") {
            agentFaceMouthRightL = agentFaceMouthRightL_;
          }
          if (agentFaceMouthRightT_ != "NaN") {
            agentFaceMouthRightT = agentFaceMouthRightT_;
          }
          agentImgFace = {
            userName: "userName",
            sensorId: "sensorId",
            agentImg: {
              base64: agentImgBase64,
              x: agentImgX,
              y: agentImgY,
              rotate: agentImgRotate,
              scale: agentImgScale,
            },
            agentFace: {
              eyeLeft: [agentFaceEyeLeftL, agentFaceEyeLeftT],
              eyeRight: [agentFaceEyeRightL, agentFaceEyeRightT],
              mouthLeft: [agentFaceMouthLeftL, agentFaceMouthLeftT],
              mouthCenter: [agentFaceMouthCenterL, agentFaceMouthCenterT],
              mouthRight: [agentFaceMouthRightL, agentFaceMouthRightT],
            },
            time: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
          };
          $("#page-03-mark-image .markers div").css("opacity", "");
        },
      }),
      $("#page-03-mark-image .markers div").mousedown(function () {
        drawZoomed(this), $("#page-03-mark-image .zoomed").css("opacity", 1);
      }),
      $("#page-03-mark-image .markers div").mouseup(function () {
        $("#page-03-mark-image .zoomed").css("opacity", 0),
          $("#instruction-1").text("");
      });
  });

  function drawZoomed(t) {
    zoomed_canvas.getContext("2d").drawImage(make_canvas, 0, 0),
      $(".zoomed canvas").css({
        width: 2 * $("#main-wrap").width(),
        height: 2.667 * $("#main-wrap").width(),
        "margin-left": "calc(50% - " + 2 * $(t).position().left + "px)",
        "margin-top": "calc(38% - " + 2 * $(t).position().top + "px)",
      });
    var e = "handle.png";
    $(t).hasClass("eye") && (e = "handle-eye.png"),
      $(".zoomed .marker").css({
        "background-image": "url(ui/design/graphics/" + e + ")",
        "background-size": $(t).css("background-size"),
        width: 2 * $(t).width(),
        "margin-left": -$(t).width(),
        height: 2 * $(t).height(),
        "margin-top": -$(t).height() - 10,
      });
    var a = "";
    $(t).hasClass("eye") &&
      ($(t).hasClass("left") && (a = labels[lang].left_eyelid),
      $(t).hasClass("right") && (a = labels[lang].right_eyelid)),
      $(t).hasClass("mouth") &&
        ($(t).hasClass("left") && (a = labels[lang].left_of_mouth),
        $(t).hasClass("center") && (a = labels[lang].center_of_mouth),
        $(t).hasClass("right") && (a = labels[lang].right_of_mouth)),
      $("#instruction-1").text(a);
  }

  function drawMouth() {
    drawImage();
    var t = make_canvas.getContext("2d");
    (t.strokeStyle = "#ffffff"), (t.lineWidth = 2), t.beginPath();
    var e = getMouthVertices();
    t.moveTo(e[0], e[1]),
      t.bezierCurveTo(
        (e[0] + e[2]) / 2,
        e[3],
        (e[0] + e[2] + e[2] + e[2]) / 4,
        e[3],
        e[2],
        e[3]
      ),
      t.bezierCurveTo(
        (e[2] + e[2] + e[2] + e[4]) / 4,
        e[3],
        (e[2] + e[4]) / 2,
        e[3],
        e[4],
        e[5]
      ),
      t.stroke();
  }

  function getMouthVertices() {
    var t = $("#main-wrap").width() / 768;
    return [
      $(".mouth.left").position().left / t,
      $(".mouth.left").position().top / t,
      $(".mouth.center").position().left / t,
      $(".mouth.center").position().top / t,
      $(".mouth.right").position().left / t,
      $(".mouth.right").position().top / t,
    ];
  }

  function markerData() {
    var t = $("#main-wrap").width() / 768;
    return [
      parseInt($(".eye.left").position().left / t),
      parseInt(1024 - $(".eye.left").position().top / t),
      parseInt($(".eye.right").position().left / t),
      parseInt(1024 - $(".eye.right").position().top / t),
      parseInt($(".mouth.left").position().left / t),
      parseInt(1024 - $(".mouth.left").position().top / t),
      parseInt($(".mouth.center").position().left / t),
      parseInt(1024 - $(".mouth.center").position().top / t),
      parseInt($(".mouth.right").position().left / t),
      parseInt(1024 - $(".mouth.right").position().top / t),
    ];
  }

  function storeData() {
    var t = make_canvas.toDataURL("image/jpeg", 0.66);
    $.ajax({
      type: "POST",
      url: "store",
      data: {
        image: t,
        marker_data: JSON.stringify(marker_data),
        name_of_person: $("#name-input").val(),
      },
    }).done(function (t) {
      (document.cookie = "created=" + t + ";path=/"),
        (window.location.href = "/?" + t);
    });
  }

  function startNodding(t) {
    nod_init("data/" + t + ".jpg", marker_data),
      $("#page-02-03-make").hide(0),
      $("#page-04-nod").show(0);
  }

  eval(
    (function (e, a, t, i, o, r) {
      if (
        ((o = function (e) {
          return (
            (e < 62 ? "" : o(parseInt(e / 62))) +
            ((e %= 62) > 35 ? String.fromCharCode(e + 29) : e.toString(36))
          );
        }),
        !"".replace(/^/, String))
      ) {
        for (; t--; ) r[o(t)] = i[t] || o(t);
        (i = [
          function (e) {
            return r[e];
          },
        ]),
          (o = function () {
            return "\\w+";
          }),
          (t = 1);
      }
      for (; t--; )
        i[t] && (e = e.replace(new RegExp("\\b" + o(t) + "\\b", "g"), i[t]));
      return e;
    })(
      "9 17={3i:'0.1.3',16:1e-6};l v(){}v.23={e:l(i){8(i<1||i>7.4.q)?w:7.4[i-1]},2R:l(){8 7.4.q},1u:l(){8 F.1x(7.2u(7))},24:l(a){9 n=7.4.q;9 V=a.4||a;o(n!=V.q){8 1L}J{o(F.13(7.4[n-1]-V[n-1])>17.16){8 1L}}H(--n);8 2x},1q:l(){8 v.u(7.4)},1b:l(a){9 b=[];7.28(l(x,i){b.19(a(x,i))});8 v.u(b)},28:l(a){9 n=7.4.q,k=n,i;J{i=k-n;a(7.4[i],i+1)}H(--n)},2q:l(){9 r=7.1u();o(r===0){8 7.1q()}8 7.1b(l(x){8 x/r})},1C:l(a){9 V=a.4||a;9 n=7.4.q,k=n,i;o(n!=V.q){8 w}9 b=0,1D=0,1F=0;7.28(l(x,i){b+=x*V[i-1];1D+=x*x;1F+=V[i-1]*V[i-1]});1D=F.1x(1D);1F=F.1x(1F);o(1D*1F===0){8 w}9 c=b/(1D*1F);o(c<-1){c=-1}o(c>1){c=1}8 F.37(c)},1m:l(a){9 b=7.1C(a);8(b===w)?w:(b<=17.16)},34:l(a){9 b=7.1C(a);8(b===w)?w:(F.13(b-F.1A)<=17.16)},2k:l(a){9 b=7.2u(a);8(b===w)?w:(F.13(b)<=17.16)},2j:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x+V[i-1]})},2C:l(a){9 V=a.4||a;o(7.4.q!=V.q){8 w}8 7.1b(l(x,i){8 x-V[i-1]})},22:l(k){8 7.1b(l(x){8 x*k})},x:l(k){8 7.22(k)},2u:l(a){9 V=a.4||a;9 i,2g=0,n=7.4.q;o(n!=V.q){8 w}J{2g+=7.4[n-1]*V[n-1]}H(--n);8 2g},2f:l(a){9 B=a.4||a;o(7.4.q!=3||B.q!=3){8 w}9 A=7.4;8 v.u([(A[1]*B[2])-(A[2]*B[1]),(A[2]*B[0])-(A[0]*B[2]),(A[0]*B[1])-(A[1]*B[0])])},2A:l(){9 m=0,n=7.4.q,k=n,i;J{i=k-n;o(F.13(7.4[i])>F.13(m)){m=7.4[i]}}H(--n);8 m},2Z:l(x){9 a=w,n=7.4.q,k=n,i;J{i=k-n;o(a===w&&7.4[i]==x){a=i+1}}H(--n);8 a},3g:l(){8 S.2X(7.4)},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(y){8(F.13(y-x)<=17.16)?x:y})},1o:l(a){o(a.K){8 a.1o(7)}9 V=a.4||a;o(V.q!=7.4.q){8 w}9 b=0,2b;7.28(l(x,i){2b=x-V[i-1];b+=2b*2b});8 F.1x(b)},3a:l(a){8 a.1h(7)},2T:l(a){8 a.1h(7)},1V:l(t,a){9 V,R,x,y,z;2S(7.4.q){27 2:V=a.4||a;o(V.q!=2){8 w}R=S.1R(t).4;x=7.4[0]-V[0];y=7.4[1]-V[1];8 v.u([V[0]+R[0][0]*x+R[0][1]*y,V[1]+R[1][0]*x+R[1][1]*y]);1I;27 3:o(!a.U){8 w}9 C=a.1r(7).4;R=S.1R(t,a.U).4;x=7.4[0]-C[0];y=7.4[1]-C[1];z=7.4[2]-C[2];8 v.u([C[0]+R[0][0]*x+R[0][1]*y+R[0][2]*z,C[1]+R[1][0]*x+R[1][1]*y+R[1][2]*z,C[2]+R[2][0]*x+R[2][1]*y+R[2][2]*z]);1I;2P:8 w}},1t:l(a){o(a.K){9 P=7.4.2O();9 C=a.1r(P).4;8 v.u([C[0]+(C[0]-P[0]),C[1]+(C[1]-P[1]),C[2]+(C[2]-(P[2]||0))])}1d{9 Q=a.4||a;o(7.4.q!=Q.q){8 w}8 7.1b(l(x,i){8 Q[i-1]+(Q[i-1]-x)})}},1N:l(){9 V=7.1q();2S(V.4.q){27 3:1I;27 2:V.4.19(0);1I;2P:8 w}8 V},2n:l(){8'['+7.4.2K(', ')+']'},26:l(a){7.4=(a.4||a).2O();8 7}};v.u=l(a){9 V=25 v();8 V.26(a)};v.i=v.u([1,0,0]);v.j=v.u([0,1,0]);v.k=v.u([0,0,1]);v.2J=l(n){9 a=[];J{a.19(F.2F())}H(--n);8 v.u(a)};v.1j=l(n){9 a=[];J{a.19(0)}H(--n);8 v.u(a)};l S(){}S.23={e:l(i,j){o(i<1||i>7.4.q||j<1||j>7.4[0].q){8 w}8 7.4[i-1][j-1]},33:l(i){o(i>7.4.q){8 w}8 v.u(7.4[i-1])},2E:l(j){o(j>7.4[0].q){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][j-1])}H(--n);8 v.u(a)},2R:l(){8{2D:7.4.q,1p:7.4[0].q}},2D:l(){8 7.4.q},1p:l(){8 7.4[0].q},24:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(7.4.q!=M.q||7.4[0].q!=M[0].q){8 1L}9 b=7.4.q,15=b,i,G,10=7.4[0].q,j;J{i=15-b;G=10;J{j=10-G;o(F.13(7.4[i][j]-M[i][j])>17.16){8 1L}}H(--G)}H(--b);8 2x},1q:l(){8 S.u(7.4)},1b:l(a){9 b=[],12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;b[i]=[];J{j=10-G;b[i][j]=a(7.4[i][j],i+1,j+1)}H(--G)}H(--12);8 S.u(b)},2i:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}8(7.4.q==M.q&&7.4[0].q==M[0].q)},2j:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x+M[i-1][j-1]})},2C:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2i(M)){8 w}8 7.1b(l(x,i,j){8 x-M[i-1][j-1]})},2B:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}8(7.4[0].q==M.q)},22:l(a){o(!a.4){8 7.1b(l(x){8 x*a})}9 b=a.1u?2x:1L;9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}o(!7.2B(M)){8 w}9 d=7.4.q,15=d,i,G,10=M[0].q,j;9 e=7.4[0].q,4=[],21,20,c;J{i=15-d;4[i]=[];G=10;J{j=10-G;21=0;20=e;J{c=e-20;21+=7.4[i][c]*M[c][j]}H(--20);4[i][j]=21}H(--G)}H(--d);9 M=S.u(4);8 b?M.2E(1):M},x:l(a){8 7.22(a)},32:l(a,b,c,d){9 e=[],12=c,i,G,j;9 f=7.4.q,1p=7.4[0].q;J{i=c-12;e[i]=[];G=d;J{j=d-G;e[i][j]=7.4[(a+i-1)%f][(b+j-1)%1p]}H(--G)}H(--12);8 S.u(e)},31:l(){9 a=7.4.q,1p=7.4[0].q;9 b=[],12=1p,i,G,j;J{i=1p-12;b[i]=[];G=a;J{j=a-G;b[i][j]=7.4[j][i]}H(--G)}H(--12);8 S.u(b)},1y:l(){8(7.4.q==7.4[0].q)},2A:l(){9 m=0,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(F.13(7.4[i][j])>F.13(m)){m=7.4[i][j]}}H(--G)}H(--12);8 m},2Z:l(x){9 a=w,12=7.4.q,15=12,i,G,10=7.4[0].q,j;J{i=15-12;G=10;J{j=10-G;o(7.4[i][j]==x){8{i:i+1,j:j+1}}}H(--G)}H(--12);8 w},30:l(){o(!7.1y){8 w}9 a=[],n=7.4.q,k=n,i;J{i=k-n;a.19(7.4[i][i])}H(--n);8 v.u(a)},1K:l(){9 M=7.1q(),1c;9 n=7.4.q,k=n,i,1s,1n=7.4[0].q,p;J{i=k-n;o(M.4[i][i]==0){2e(j=i+1;j<k;j++){o(M.4[j][i]!=0){1c=[];1s=1n;J{p=1n-1s;1c.19(M.4[i][p]+M.4[j][p])}H(--1s);M.4[i]=1c;1I}}}o(M.4[i][i]!=0){2e(j=i+1;j<k;j++){9 a=M.4[j][i]/M.4[i][i];1c=[];1s=1n;J{p=1n-1s;1c.19(p<=i?0:M.4[j][p]-M.4[i][p]*a)}H(--1s);M.4[j]=1c}}}H(--n);8 M},3h:l(){8 7.1K()},2z:l(){o(!7.1y()){8 w}9 M=7.1K();9 a=M.4[0][0],n=M.4.q-1,k=n,i;J{i=k-n+1;a=a*M.4[i][i]}H(--n);8 a},3f:l(){8 7.2z()},2y:l(){8(7.1y()&&7.2z()===0)},2Y:l(){o(!7.1y()){8 w}9 a=7.4[0][0],n=7.4.q-1,k=n,i;J{i=k-n+1;a+=7.4[i][i]}H(--n);8 a},3e:l(){8 7.2Y()},1Y:l(){9 M=7.1K(),1Y=0;9 a=7.4.q,15=a,i,G,10=7.4[0].q,j;J{i=15-a;G=10;J{j=10-G;o(F.13(M.4[i][j])>17.16){1Y++;1I}}H(--G)}H(--a);8 1Y},3d:l(){8 7.1Y()},2W:l(a){9 M=a.4||a;o(1g(M[0][0])=='1f'){M=S.u(M).4}9 T=7.1q(),1p=T.4[0].q;9 b=T.4.q,15=b,i,G,10=M[0].q,j;o(b!=M.q){8 w}J{i=15-b;G=10;J{j=10-G;T.4[i][1p+j]=M[i][j]}H(--G)}H(--b);8 T},2w:l(){o(!7.1y()||7.2y()){8 w}9 a=7.4.q,15=a,i,j;9 M=7.2W(S.I(a)).1K();9 b,1n=M.4[0].q,p,1c,2v;9 c=[],2c;J{i=a-1;1c=[];b=1n;c[i]=[];2v=M.4[i][i];J{p=1n-b;2c=M.4[i][p]/2v;1c.19(2c);o(p>=15){c[i].19(2c)}}H(--b);M.4[i]=1c;2e(j=0;j<i;j++){1c=[];b=1n;J{p=1n-b;1c.19(M.4[j][p]-M.4[i][p]*M.4[j][i])}H(--b);M.4[j]=1c}}H(--a);8 S.u(c)},3c:l(){8 7.2w()},2d:l(){8 7.1b(l(x){8 F.2d(x)})},2V:l(x){8 7.1b(l(p){8(F.13(p-x)<=17.16)?x:p})},2n:l(){9 a=[];9 n=7.4.q,k=n,i;J{i=k-n;a.19(v.u(7.4[i]).2n())}H(--n);8 a.2K('\\n')},26:l(a){9 i,4=a.4||a;o(1g(4[0][0])!='1f'){9 b=4.q,15=b,G,10,j;7.4=[];J{i=15-b;G=4[i].q;10=G;7.4[i]=[];J{j=10-G;7.4[i][j]=4[i][j]}H(--G)}H(--b);8 7}9 n=4.q,k=n;7.4=[];J{i=k-n;7.4.19([4[i]])}H(--n);8 7}};S.u=l(a){9 M=25 S();8 M.26(a)};S.I=l(n){9 a=[],k=n,i,G,j;J{i=k-n;a[i]=[];G=k;J{j=k-G;a[i][j]=(i==j)?1:0}H(--G)}H(--n);8 S.u(a)};S.2X=l(a){9 n=a.q,k=n,i;9 M=S.I(n);J{i=k-n;M.4[i][i]=a[i]}H(--n);8 M};S.1R=l(b,a){o(!a){8 S.u([[F.1H(b),-F.1G(b)],[F.1G(b),F.1H(b)]])}9 d=a.1q();o(d.4.q!=3){8 w}9 e=d.1u();9 x=d.4[0]/e,y=d.4[1]/e,z=d.4[2]/e;9 s=F.1G(b),c=F.1H(b),t=1-c;8 S.u([[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]])};S.3b=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[1,0,0],[0,c,-s],[0,s,c]])};S.39=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,0,s],[0,1,0],[-s,0,c]])};S.38=l(t){9 c=F.1H(t),s=F.1G(t);8 S.u([[c,-s,0],[s,c,0],[0,0,1]])};S.2J=l(n,m){8 S.1j(n,m).1b(l(){8 F.2F()})};S.1j=l(n,m){9 a=[],12=n,i,G,j;J{i=n-12;a[i]=[];G=m;J{j=m-G;a[i][j]=0}H(--G)}H(--12);8 S.u(a)};l 14(){}14.23={24:l(a){8(7.1m(a)&&7.1h(a.K))},1q:l(){8 14.u(7.K,7.U)},2U:l(a){9 V=a.4||a;8 14.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.U)},1m:l(a){o(a.W){8 a.1m(7)}9 b=7.U.1C(a.U);8(F.13(b)<=17.16||F.13(b-F.1A)<=17.16)},1o:l(a){o(a.W){8 a.1o(7)}o(a.U){o(7.1m(a)){8 7.1o(a.K)}9 N=7.U.2f(a.U).2q().4;9 A=7.K.4,B=a.K.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,D=7.U.4;9 b=P[0]-A[0],2a=P[1]-A[1],29=(P[2]||0)-A[2];9 c=F.1x(b*b+2a*2a+29*29);o(c===0)8 0;9 d=(b*D[0]+2a*D[1]+29*D[2])/c;9 e=1-d*d;8 F.13(c*F.1x(e<0?0:e))}},1h:l(a){9 b=7.1o(a);8(b!==w&&b<=17.16)},2T:l(a){8 a.1h(7)},1v:l(a){o(a.W){8 a.1v(7)}8(!7.1m(a)&&7.1o(a)<=17.16)},1U:l(a){o(a.W){8 a.1U(7)}o(!7.1v(a)){8 w}9 P=7.K.4,X=7.U.4,Q=a.K.4,Y=a.U.4;9 b=X[0],1z=X[1],1B=X[2],1T=Y[0],1S=Y[1],1M=Y[2];9 c=P[0]-Q[0],2s=P[1]-Q[1],2r=P[2]-Q[2];9 d=-b*c-1z*2s-1B*2r;9 e=1T*c+1S*2s+1M*2r;9 f=b*b+1z*1z+1B*1B;9 g=1T*1T+1S*1S+1M*1M;9 h=b*1T+1z*1S+1B*1M;9 k=(d*g/f+h*e)/(g-h*h);8 v.u([P[0]+k*b,P[1]+k*1z,P[2]+k*1B])},1r:l(a){o(a.U){o(7.1v(a)){8 7.1U(a)}o(7.1m(a)){8 w}9 D=7.U.4,E=a.U.4;9 b=D[0],1l=D[1],1k=D[2],1P=E[0],1O=E[1],1Q=E[2];9 x=(1k*1P-b*1Q),y=(b*1O-1l*1P),z=(1l*1Q-1k*1O);9 N=v.u([x*1Q-y*1O,y*1P-z*1Q,z*1O-x*1P]);9 P=11.u(a.K,N);8 P.1U(7)}1d{9 P=a.4||a;o(7.1h(P)){8 v.u(P)}9 A=7.K.4,D=7.U.4;9 b=D[0],1l=D[1],1k=D[2],1w=A[0],18=A[1],1a=A[2];9 x=b*(P[1]-18)-1l*(P[0]-1w),y=1l*((P[2]||0)-1a)-1k*(P[1]-18),z=1k*(P[0]-1w)-b*((P[2]||0)-1a);9 V=v.u([1l*x-1k*z,1k*y-b*x,b*z-1l*y]);9 k=7.1o(P)/V.1u();8 v.u([P[0]+V.4[0]*k,P[1]+V.4[1]*k,(P[2]||0)+V.4[2]*k])}},1V:l(t,a){o(1g(a.U)=='1f'){a=14.u(a.1N(),v.k)}9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,D=7.U.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 14.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*D[0]+R[0][1]*D[1]+R[0][2]*D[2],R[1][0]*D[0]+R[1][1]*D[1]+R[1][2]*D[2],R[2][0]*D[0]+R[2][1]*D[1]+R[2][2]*D[2]])},1t:l(a){o(a.W){9 A=7.K.4,D=7.U.4;9 b=A[0],18=A[1],1a=A[2],2N=D[0],1l=D[1],1k=D[2];9 c=7.K.1t(a).4;9 d=b+2N,2h=18+1l,2o=1a+1k;9 Q=a.1r([d,2h,2o]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2h)-c[1],Q[2]+(Q[2]-2o)-c[2]];8 14.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 14.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.U)}},1Z:l(a,b){a=v.u(a);b=v.u(b);o(a.4.q==2){a.4.19(0)}o(b.4.q==2){b.4.19(0)}o(a.4.q>3||b.4.q>3){8 w}9 c=b.1u();o(c===0){8 w}7.K=a;7.U=v.u([b.4[0]/c,b.4[1]/c,b.4[2]/c]);8 7}};14.u=l(a,b){9 L=25 14();8 L.1Z(a,b)};14.X=14.u(v.1j(3),v.i);14.Y=14.u(v.1j(3),v.j);14.Z=14.u(v.1j(3),v.k);l 11(){}11.23={24:l(a){8(7.1h(a.K)&&7.1m(a))},1q:l(){8 11.u(7.K,7.W)},2U:l(a){9 V=a.4||a;8 11.u([7.K.4[0]+V[0],7.K.4[1]+V[1],7.K.4[2]+(V[2]||0)],7.W)},1m:l(a){9 b;o(a.W){b=7.W.1C(a.W);8(F.13(b)<=17.16||F.13(F.1A-b)<=17.16)}1d o(a.U){8 7.W.2k(a.U)}8 w},2k:l(a){9 b=7.W.1C(a.W);8(F.13(F.1A/2-b)<=17.16)},1o:l(a){o(7.1v(a)||7.1h(a)){8 0}o(a.K){9 A=7.K.4,B=a.K.4,N=7.W.4;8 F.13((A[0]-B[0])*N[0]+(A[1]-B[1])*N[1]+(A[2]-B[2])*N[2])}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;8 F.13((A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2])}},1h:l(a){o(a.W){8 w}o(a.U){8(7.1h(a.K)&&7.1h(a.K.2j(a.U)))}1d{9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=F.13(N[0]*(A[0]-P[0])+N[1]*(A[1]-P[1])+N[2]*(A[2]-(P[2]||0)));8(b<=17.16)}},1v:l(a){o(1g(a.U)=='1f'&&1g(a.W)=='1f'){8 w}8!7.1m(a)},1U:l(a){o(!7.1v(a)){8 w}o(a.U){9 A=a.K.4,D=a.U.4,P=7.K.4,N=7.W.4;9 b=(N[0]*(P[0]-A[0])+N[1]*(P[1]-A[1])+N[2]*(P[2]-A[2]))/(N[0]*D[0]+N[1]*D[1]+N[2]*D[2]);8 v.u([A[0]+D[0]*b,A[1]+D[1]*b,A[2]+D[2]*b])}1d o(a.W){9 c=7.W.2f(a.W).2q();9 N=7.W.4,A=7.K.4,O=a.W.4,B=a.K.4;9 d=S.1j(2,2),i=0;H(d.2y()){i++;d=S.u([[N[i%3],N[(i+1)%3]],[O[i%3],O[(i+1)%3]]])}9 e=d.2w().4;9 x=N[0]*A[0]+N[1]*A[1]+N[2]*A[2];9 y=O[0]*B[0]+O[1]*B[1]+O[2]*B[2];9 f=[e[0][0]*x+e[0][1]*y,e[1][0]*x+e[1][1]*y];9 g=[];2e(9 j=1;j<=3;j++){g.19((i==j)?0:f[(j+(5-i)%3)%3])}8 14.u(g,c)}},1r:l(a){9 P=a.4||a;9 A=7.K.4,N=7.W.4;9 b=(A[0]-P[0])*N[0]+(A[1]-P[1])*N[1]+(A[2]-(P[2]||0))*N[2];8 v.u([P[0]+N[0]*b,P[1]+N[1]*b,(P[2]||0)+N[2]*b])},1V:l(t,a){9 R=S.1R(t,a.U).4;9 C=a.1r(7.K).4;9 A=7.K.4,N=7.W.4;9 b=C[0],1E=C[1],1J=C[2],1w=A[0],18=A[1],1a=A[2];9 x=1w-b,y=18-1E,z=1a-1J;8 11.u([b+R[0][0]*x+R[0][1]*y+R[0][2]*z,1E+R[1][0]*x+R[1][1]*y+R[1][2]*z,1J+R[2][0]*x+R[2][1]*y+R[2][2]*z],[R[0][0]*N[0]+R[0][1]*N[1]+R[0][2]*N[2],R[1][0]*N[0]+R[1][1]*N[1]+R[1][2]*N[2],R[2][0]*N[0]+R[2][1]*N[1]+R[2][2]*N[2]])},1t:l(a){o(a.W){9 A=7.K.4,N=7.W.4;9 b=A[0],18=A[1],1a=A[2],2M=N[0],2L=N[1],2Q=N[2];9 c=7.K.1t(a).4;9 d=b+2M,2p=18+2L,2m=1a+2Q;9 Q=a.1r([d,2p,2m]).4;9 e=[Q[0]+(Q[0]-d)-c[0],Q[1]+(Q[1]-2p)-c[1],Q[2]+(Q[2]-2m)-c[2]];8 11.u(c,e)}1d o(a.U){8 7.1V(F.1A,a)}1d{9 P=a.4||a;8 11.u(7.K.1t([P[0],P[1],(P[2]||0)]),7.W)}},1Z:l(a,b,c){a=v.u(a);a=a.1N();o(a===w){8 w}b=v.u(b);b=b.1N();o(b===w){8 w}o(1g(c)=='1f'){c=w}1d{c=v.u(c);c=c.1N();o(c===w){8 w}}9 d=a.4[0],18=a.4[1],1a=a.4[2];9 e=b.4[0],1W=b.4[1],1X=b.4[2];9 f,1i;o(c!==w){9 g=c.4[0],2l=c.4[1],2t=c.4[2];f=v.u([(1W-18)*(2t-1a)-(1X-1a)*(2l-18),(1X-1a)*(g-d)-(e-d)*(2t-1a),(e-d)*(2l-18)-(1W-18)*(g-d)]);1i=f.1u();o(1i===0){8 w}f=v.u([f.4[0]/1i,f.4[1]/1i,f.4[2]/1i])}1d{1i=F.1x(e*e+1W*1W+1X*1X);o(1i===0){8 w}f=v.u([b.4[0]/1i,b.4[1]/1i,b.4[2]/1i])}7.K=a;7.W=f;8 7}};11.u=l(a,b,c){9 P=25 11();8 P.1Z(a,b,c)};11.2I=11.u(v.1j(3),v.k);11.2H=11.u(v.1j(3),v.i);11.2G=11.u(v.1j(3),v.j);11.36=11.2I;11.35=11.2H;11.3j=11.2G;9 $V=v.u;9 $M=S.u;9 $L=14.u;9 $P=11.u;",
      0,
      206,
      "||||elements|||this|return|var||||||||||||function|||if||length||||create|Vector|null|||||||||Math|nj|while||do|anchor||||||||Matrix||direction||normal||||kj|Plane|ni|abs|Line|ki|precision|Sylvester|A2|push|A3|map|els|else||undefined|typeof|contains|mod|Zero|D3|D2|isParallelTo|kp|distanceFrom|cols|dup|pointClosestTo|np|reflectionIn|modulus|intersects|A1|sqrt|isSquare|X2|PI|X3|angleFrom|mod1|C2|mod2|sin|cos|break|C3|toRightTriangular|false|Y3|to3D|E2|E1|E3|Rotation|Y2|Y1|intersectionWith|rotate|v12|v13|rank|setVectors|nc|sum|multiply|prototype|eql|new|setElements|case|each|PA3|PA2|part|new_element|round|for|cross|product|AD2|isSameSizeAs|add|isPerpendicularTo|v22|AN3|inspect|AD3|AN2|toUnitVector|PsubQ3|PsubQ2|v23|dot|divisor|inverse|true|isSingular|determinant|max|canMultiplyFromLeft|subtract|rows|col|random|ZX|YZ|XY|Random|join|N2|N1|D1|slice|default|N3|dimensions|switch|liesIn|translate|snapTo|augment|Diagonal|trace|indexOf|diagonal|transpose|minor|row|isAntiparallelTo|ZY|YX|acos|RotationZ|RotationY|liesOn|RotationX|inv|rk|tr|det|toDiagonalMatrix|toUpperTriangular|version|XZ".split(
        "|"
      ),
      0,
      {}
    )
  ),
    (Matrix.Translation = function (e) {
      if (2 == e.elements.length) {
        return (
          ((a = Matrix.I(3)).elements[2][0] = e.elements[0]),
          (a.elements[2][1] = e.elements[1]),
          a
        );
      }
      if (3 == e.elements.length) {
        var a;
        return (
          ((a = Matrix.I(4)).elements[0][3] = e.elements[0]),
          (a.elements[1][3] = e.elements[1]),
          (a.elements[2][3] = e.elements[2]),
          a
        );
      }
      throw "Invalid length for Translation";
    }),
    (Matrix.prototype.flatten = function () {
      var e = [];
      if (0 == this.elements.length) return [];
      for (var a = 0; a < this.elements[0].length; a++)
        for (var t = 0; t < this.elements.length; t++)
          e.push(this.elements[t][a]);
      return e;
    }),
    (Matrix.prototype.ensure4x4 = function () {
      if (4 == this.elements.length && 4 == this.elements[0].length)
        return this;
      if (this.elements.length > 4 || this.elements[0].length > 4) return null;
      for (var e = 0; e < this.elements.length; e++)
        for (var a = this.elements[e].length; a < 4; a++)
          e == a ? this.elements[e].push(1) : this.elements[e].push(0);
      for (e = this.elements.length; e < 4; e++)
        0 == e
          ? this.elements.push([1, 0, 0, 0])
          : 1 == e
          ? this.elements.push([0, 1, 0, 0])
          : 2 == e
          ? this.elements.push([0, 0, 1, 0])
          : 3 == e && this.elements.push([0, 0, 0, 1]);
      return this;
    }),
    (Matrix.prototype.make3x3 = function () {
      return 4 != this.elements.length || 4 != this.elements[0].length
        ? null
        : Matrix.create([
            [this.elements[0][0], this.elements[0][1], this.elements[0][2]],
            [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
            [this.elements[2][0], this.elements[2][1], this.elements[2][2]],
          ]);
    }),
    (Vector.prototype.flatten = function () {
      return this.elements;
    });
  var gl_perspectiveMatrix;

  function gl_makePerspective(e, a, t, i) {
    var o = t * Math.tan((e * Math.PI) / 360),
      r = -o;
    gl_perspectiveMatrix = gl_makeFrustum(r * a, o * a, r, o, t, i);
  }

  function gl_makeFrustum(e, a, t, i, o, r) {
    return $M([
      [(2 * o) / (a - e), 0, (a + e) / (a - e), 0],
      [0, (2 * o) / (i - t), (i + t) / (i - t), 0],
      [0, 0, -(r + o) / (r - o), (-2 * r * o) / (r - o)],
      [0, 0, -1, 0],
    ]);
  }
  var gl_shaderProgram, gl_vertexPositionAttribute, gl_textureCoordAttribute;

  function gl_initShaders() {
    var e = gl_getShader(gl, "fragment"),
      a = gl_getShader(gl, "vertex");
    (gl_shaderProgram = gl.createProgram()),
      gl.attachShader(gl_shaderProgram, a),
      gl.attachShader(gl_shaderProgram, e),
      gl.linkProgram(gl_shaderProgram),
      gl.getProgramParameter(gl_shaderProgram, gl.LINK_STATUS) ||
        alert(
          "Unable to initialize the shader program: " +
            gl.getProgramInfoLog(shader)
        ),
      gl.useProgram(gl_shaderProgram),
      (gl_vertexPositionAttribute = gl.getAttribLocation(
        gl_shaderProgram,
        "aVertexPosition"
      )),
      gl.enableVertexAttribArray(gl_vertexPositionAttribute),
      (gl_textureCoordAttribute = gl.getAttribLocation(
        gl_shaderProgram,
        "aTextureCoord"
      )),
      gl.enableVertexAttribArray(gl_textureCoordAttribute);
  }

  function gl_getShader(e, a) {
    var t;
    return (
      "fragment" == a
        ? ((theSource =
            "varying highp vec2 vTextureCoord;uniform sampler2D uSampler;void main(void) {gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));}"),
          (t = e.createShader(e.FRAGMENT_SHADER)))
        : "vertex" == a &&
          ((theSource =
            "attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying highp vec2 vTextureCoord;void main(void) {gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);vTextureCoord = aTextureCoord;}"),
          (t = e.createShader(e.VERTEX_SHADER))),
      e.shaderSource(t, theSource),
      e.compileShader(t),
      e.getShaderParameter(t, e.COMPILE_STATUS)
        ? t
        : (alert(
            "An error occurred compiling the shaders: " + e.getShaderInfoLog(t)
          ),
          null)
    );
  }

  function gl_loadIdentity() {
    mvMatrix = Matrix.I(4);
  }

  function gl_multMatrix(e) {
    mvMatrix = mvMatrix.x(e);
  }

  function gl_mvTranslate(e) {
    gl_multMatrix(Matrix.Translation($V([e[0], e[1], e[2]])).ensure4x4());
  }

  function gl_setMatrixUniforms() {
    var e = gl.getUniformLocation(gl_shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(
      e,
      !1,
      new Float32Array(gl_perspectiveMatrix.flatten())
    );
    var a = gl.getUniformLocation(gl_shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(a, !1, new Float32Array(mvMatrix.flatten()));
  }
  var nm = [
      {
        x: [
          -1, -1, -2, -4, -3, 4, 5, 0, -5, -8, -9, -11, -11, -11, -4, 11, 13,
          15, 14, 11, 5, -7, -13, -15, -16, -16, -15, -14, -14, -14, -7, -4, -2,
          -1, -2, -4, -11, -17, -17, -17, -20, -20, -17, -17, -19, -24, -30,
          -35, -38, -40, -40, -40, -38, -30, -21, -11, -3, 2, 3, 2, -1, -2, -1,
          -1, -4, -4, -2, 7, 14, 15, 15, 17, 17, 18, 14, 12, 10, 7, 4, 3, 6, 12,
          10, 13, 17, 18, 15, 8, 10, 10, 6, 2, -1, 6, 20, 24, 24, 20, 10, 0, -7,
          -9, -9, -9, -9, -9, -9, -9, -7, -4, -2, -3, -4, -4, -5, -4, 1, 5, -2,
          -6, -11, -16, -17, -18, -21, -24, -25, -29, -30, -24, -20, -21, -24,
          -28, -34, -37, -38, -39, -38, -37, -35, -33, -30, -23, -18, -13, -9,
          -8, -11, -15, -13, -13, -14, -14, -11, -7, -3, -3, -8, -12, -14, -16,
          -18, -20, -19, -15, -10, -2, -3, -6, -7, -5, -1, 1, 4, 6, 4, -6, -18,
          -19, -21, -23, -22, -23, -20, -8, -8, -11, -12, -10, -7, -2, 7, 14,
          19, 20, 14, 6, 1, -1, -2, -3, 0, 3, 2, 0, 2, 4, 1, -5, -11, -17, -22,
          -27, -29, -29, -28, -28, -27, -25, -23, -22, -21, -21, -22, -22, -23,
          -28, -31, -38, -45, -51, -55, -59, -61, -61, -60, -59, -59, -59, -58,
          -58, -51, -39, -29, -29, -28, -30, -32, -33, -32, -32, -31, -31, -29,
          -27, -22, -12, -5, 0, 0, -7, -14, -11, -10, -9, -5, 2, 8, 7, -10, -19,
          -23, -27, -31, -33, -34, -32, -29, -25, -23, -16, -10, -11, -13, -17,
          -19, -20, -21, -22, -23, -25, -25, -25, -25, -25, -23, -12, 1, 1, -4,
          -8, -4, -4, 3, 12, 10, 9, 8, 9, 10, 11, 13, 8, 1, -2, -6, -9, -10, -6,
          1, 5, 6, 6, 5, 0, -7, -11, -15, -18, -20, -24, -27, -28, -29, -29,
          -27, -26, -26, -20, -6, 0, 0, 1, 3, 2, 1, 3, 6, 8, 8, 5, -4, -12, -21,
          -26, -25, -26, -25, -24, -23, -23, -21, -20, -20, -19, -20, -20, -20,
          -19, -17, -16, -16, -16, -17, -18, -18, -19, -19, -19, -18, -17, -17,
          -17, -17, -18, -18, -19, -19, -19, -19, -19, -19, -18, -17, -17, -16,
          -16, -15, -15, -15, -15, -15, -15, -16, -16, -16, -16, -16, -17, -17,
          -18, -18, -18, -18, -18, -18, -17, -17, -16, -16, -15, -15, -16, -16,
          -16, -15, -15, -15, -15, -15, -16, -16, -16, -16, -16, -17, -17, -17,
          -16, -16, -15, -15, -16, -17, -18, -18, -18, -17, -17, -17, -17, -18,
          -18, -21, -25, -30, -36, -36, -32, -24, -17, -17, -21, -25, -29, -30,
          -29, -30, -32, -34, -37, -39, -41, -42, -42, -42, -44, -45, -46, -49,
          -50, -50, -51, -53, -54, -51, -48, -45, -41, -40, -40, -40, -38, -35,
          -29, -24, -26, -29, -33, -34, -31, -27, -28, -30, -31, -30, -29, -28,
          -24, -16, -10, -4, -1, 1, 0, -7, -14, -19, -24, -27, -25, -21, -15,
          -7, -10, -14, -16, -17, -17, -16, -16, -15, -15, -19, -23, -26, -27,
          -29, -29, -29, -28, -28, -26, -22, -22, -23, -23, -24, -25, -25, -22,
          -21, -23, -25, -27, -28, -28, -26, -27, -26, -25, -22, -19, -16, -6,
          3, 8, 9, 7, 4, 2, 1, 8, 12, 16, 20, 20, 17, 10, 12, 14, 16, 16, 16, 8,
          -9, -17, -22, -25, -28, -29, -31, -33, -33, -33, -33, -33, -34, -32,
          -26, -25, -25, -26, -26, -27, -27, -24, -20, -20, -22, -25, -28, -29,
          -28, -24, -24, -25, -27, -31, -33, -33, -32, -31, -30, -31, -32, -32,
          -25, -21, -20, -21, -24, -24, -22, -19, -17, -17, -18, -18, -18, -17,
          -17, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -16, -15, -15,
          -15, -15, -15, -15, -14, -14, -14, -15, -17, -19, -23, -22, -16, -15,
          -13, -16, -23, -27, -30, -30, -30, -29, -26, -15, 6, 13, 16, 18, 16,
          12, 15, 11, 3, -9, -15, -19, -23, -25, -27, -29, -29, -30, -30, -29,
          -29, -28, -26, -22, -17, -15, -16, -20, -24, -27, -29, -28, -27, -24,
          -14, -15, -16, -17, -18, -18, -15, -14, -15, -17, -20, -22, -22, -19,
          -19, -21, -23, -22, -21, -20, -18, -13, -8, -5, -3, -1, 2, 4, 6, 6, 7,
          9, 12, 14, 10, -3, -10, -15, -18, -22, -26, -30, -34, -36, -35, -34,
          -30, -26, -22, -7, 3, 6, 8, 8, 8, 4, -6, -11, -15, -19, -22, -22, -17,
          -16, -18, -20, -23, -27, -28, -28, -28, -27, -25, -25, -23, -22, -19,
          -14, -9, -5, -4, -6, -8, -6, -3, -3, -4, -6, -11, -15, -18, -20, -22,
          -25, -26, -24, -24, -22, -21, -20, -19, -18, -17, -16, -15, -14, -15,
          -15, -15, -15, -14, -14, -13, -13, -14, -14, -14, -14, -13, -15, -14,
          -11, -8, -2, -2, -8, -12, -13, -14, -12, -10, -8, -6, -2, 7, 15, 22,
          21, 9, -7, -14, -14, -13, -17, -23, -27, -33, -36, -34, -33, -33, -32,
          -33, -33, -33, -34, -34, -34, -36, -37, -36, -36, -37, -41, -41, -42,
          -45, -43, -40, -38, -38, -37, -36, -35, -33, -31, -30, -30, -31, -31,
          -29, -26, -23, -19,
        ],
        y: [
          -1, -1, -1, 0, 3, 13, 20, 18, 13, 9, 6, 2, 2, 2, 7, 28, 48, 56, 53,
          44, 29, 11, -4, -11, -11, -11, -10, -9, -8, -3, 14, 24, 20, 0, -16,
          -22, -28, -20, -6, -2, -10, -16, -23, -32, -37, -32, -28, -31, -35,
          -39, -42, -43, -37, -20, -3, 10, 11, 18, 22, 22, 25, 31, 36, 40, 32,
          24, 26, 43, 56, 52, 44, 39, 34, 39, 50, 56, 53, 49, 44, 42, 48, 60,
          58, 50, 39, 34, 35, 43, 51, 49, 42, 34, 31, 37, 64, 77, 74, 68, 53,
          37, 25, 20, 22, 22, 22, 21, 21, 21, 21, 21, 20, 19, 19, 18, 19, 21,
          28, 35, 31, 17, 4, -5, -9, -14, -19, -22, -23, -28, -29, -12, 6, 7,
          -2, -14, -21, -26, -28, -29, -29, -28, -26, -21, -14, 3, 10, 9, 4, -2,
          -6, -1, 3, 6, 5, 6, 4, -3, -4, -1, 5, 7, 4, 0, -5, -8, -6, 0, 12, 27,
          32, 33, 31, 32, 31, 31, 34, 32, 27, 27, 26, 28, 24, 21, 23, 27, 31,
          47, 50, 44, 39, 37, 35, 36, 49, 63, 61, 59, 61, 62, 61, 58, 55, 51,
          45, 40, 40, 53, 74, 86, 84, 74, 63, 50, 41, 38, 39, 37, 35, 34, 34,
          35, 36, 36, 36, 37, 37, 37, 32, 21, 15, 9, 1, -8, -14, -18, -22, -22,
          -22, -22, -21, -21, -21, -20, -8, 18, 35, 25, 13, 6, 0, -2, -2, -3,
          -3, -1, 3, 9, 15, 20, 16, 15, 17, 21, 29, 39, 42, 41, 35, 27, 24, 23,
          23, 24, 20, 14, 8, 4, 2, 4, 10, 18, 19, 27, 40, 42, 41, 43, 46, 45,
          44, 43, 43, 41, 41, 41, 41, 41, 44, 64, 93, 93, 78, 59, 53, 52, 62,
          85, 88, 81, 72, 64, 58, 58, 70, 77, 76, 72, 65, 60, 58, 60, 71, 77,
          71, 64, 59, 57, 58, 57, 55, 54, 50, 46, 42, 40, 39, 39, 42, 42, 43,
          49, 71, 83, 78, 75, 73, 72, 78, 91, 97, 98, 97, 93, 77, 59, 47, 38,
          39, 39, 38, 38, 38, 38, 39, 41, 42, 43, 45, 46, 46, 46, 47, 47, 48,
          48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 50, 50, 49, 49, 49, 49, 49,
          49, 49, 49, 49, 49, 49, 48, 48, 49, 49, 49, 49, 49, 49, 48, 48, 48,
          48, 47, 48, 48, 48, 48, 47, 47, 47, 46, 46, 46, 46, 46, 46, 46, 47,
          47, 47, 48, 48, 48, 48, 49, 49, 49, 49, 49, 49, 49, 49, 48, 48, 48,
          48, 48, 47, 46, 46, 46, 46, 45, 45, 44, 41, 29, 30, 26, 13, -1, -11,
          -15, -13, -2, 10, 13, 13, 14, 16, 20, 27, 30, 32, 31, 28, 25, 24, 22,
          20, 17, 14, 10, 6, 1, -1, -1, 0, -1, -1, -1, 0, 3, 9, 11, 11, 11, 12,
          18, 30, 49, 51, 45, 41, 36, 35, 39, 39, 37, 37, 39, 40, 41, 46, 58,
          63, 61, 58, 54, 54, 57, 58, 52, 45, 42, 40, 39, 38, 47, 62, 66, 60,
          57, 56, 55, 55, 54, 51, 45, 35, 27, 21, 19, 22, 23, 23, 24, 32, 46,
          46, 43, 40, 39, 37, 38, 46, 52, 47, 41, 34, 30, 30, 33, 36, 36, 38,
          40, 42, 44, 53, 60, 58, 56, 56, 54, 56, 61, 74, 79, 78, 76, 72, 69,
          71, 73, 73, 71, 69, 67, 60, 49, 43, 37, 31, 26, 24, 21, 17, 16, 15,
          14, 14, 15, 18, 28, 31, 31, 30, 29, 29, 29, 36, 46, 47, 41, 34, 27,
          23, 24, 31, 32, 29, 26, 24, 21, 22, 24, 25, 25, 25, 24, 25, 37, 47,
          46, 40, 35, 34, 36, 43, 52, 52, 52, 53, 53, 53, 53, 53, 53, 54, 54,
          54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 55, 55, 55, 55, 55,
          55, 56, 56, 60, 70, 75, 76, 70, 51, 34, 27, 26, 27, 30, 35, 53, 91,
          106, 94, 85, 80, 88, 106, 103, 88, 68, 56, 48, 42, 38, 35, 33, 31, 30,
          30, 30, 28, 26, 25, 30, 37, 35, 31, 26, 20, 19, 21, 23, 24, 29, 48,
          47, 44, 42, 41, 43, 50, 56, 54, 50, 44, 39, 38, 43, 47, 47, 48, 49,
          51, 53, 58, 67, 72, 71, 68, 65, 65, 71, 83, 88, 85, 80, 72, 71, 76,
          78, 72, 63, 53, 42, 33, 25, 20, 17, 16, 18, 26, 37, 50, 81, 96, 93,
          90, 86, 83, 79, 70, 62, 52, 41, 37, 39, 48, 52, 50, 46, 41, 36, 36,
          40, 44, 47, 48, 46, 46, 48, 51, 53, 55, 56, 57, 58, 63, 78, 89, 90,
          83, 74, 66, 61, 59, 56, 53, 48, 45, 43, 41, 41, 40, 40, 41, 42, 43,
          43, 45, 50, 53, 58, 64, 68, 70, 71, 72, 72, 72, 71, 70, 70, 69, 70,
          78, 88, 89, 87, 82, 75, 73, 72, 70, 70, 71, 72, 74, 79, 87, 89, 87,
          74, 66, 65, 68, 73, 73, 56, 42, 34, 32, 33, 34, 35, 34, 33, 32, 31,
          31, 31, 30, 28, 25, 25, 26, 26, 25, 23, 23, 22, 20, 19, 19, 23, 26,
          31, 34, 34, 34, 34, 32, 30, 27, 25, 22, 18, 15, 10,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -4, -4, -2, -2, -5, -8, -11, -11, -11, -11, -11, -10,
          -10, -14, -18, -19, -20, -21, -21, -23, -26, -27, -27, -26, -26, -29,
          -31, -31, -24, -13, -2, 3, 1, -6, -22, -27, -28, -27, -27, -23, -21,
          -23, -28, -32, -33, -34, -34, -33, -31, -32, -31, -29, -24, -14, -7,
          -2, -2, -5, -7, -8, -10, -17, -22, -21, -14, -1, 10, 13, 14, 17, 16,
          7, 2, 0, 1, 1, 1, 1, 3, 4, 14, 21, 20, 16, 7, 4, 4, 3, 3, 3, 4, 7, 7,
          8, 7, 3, 2, 2, 2, 1, 2, 2, 2, 2, 2, 4, 7, 9, 9, 8, 7, 7, 6, 8, 3, -7,
          -10, -11, -11, -11, -12, -14, -16, -16, -17, -20, -21, -22, -23, -23,
          -23, -22, -22, -22, -22, -21, -21, -21, -21, -26, -25, -23, -18, -8,
          -5, -7, -13, -18, -19, -20, -20, -16, -10, -6, -6, -13, -17, -17, -16,
          -16, -16, -16, -16, -15, -7, -7, -10, -10, -12, -16, -16, -11, -4, -3,
          -6, -9, -11, -15, -16, -16, -14, -13, -10, -11, -12, -15, -17, -18,
          -15, -8, 5, 13, 15, 10, 0, -5, -7, -8, -6, 3, 7, 5, -1, -12, -16, -18,
          -21, -23, -28, -30, -30, -29, -26, -24, -23, -21, -19, -16, -14, -13,
          -13, -14, -14, -17, -23, -30, -37, -44, -47, -49, -50, -50, -49, -49,
          -48, -47, -47, -46, -46, -46, -44, -39, -36, -35, -34, -35, -36, -37,
          -35, -34, -34, -34, -35, -30, -14, -4, 1, 1, -6, -17, -21, -22, -22,
          -16, -2, 6, 6, -9, -21, -23, -24, -25, -25, -25, -25, -24, -24, -22,
          -15, -8, -7, -7, -8, -9, -9, -9, -10, -11, -12, -12, -12, -12, -13,
          -13, -9, -7, -7, -7, -9, -9, -8, -5, 0, -1, 0, 4, 9, 9, 9, 10, 8, 2,
          0, -1, -3, -3, -2, -1, 4, 11, 15, 14, 11, 0, -6, -9, -10, -11, -12,
          -13, -14, -16, -16, -19, -19, -18, -17, -12, -8, -7, -3, -1, 4, -6,
          -13, -14, -14, -15, -15, -17, -21, -21, -23, -24, -25, -24, -23, -23,
          -22, -21, -18, -17, -15, -15, -15, -15, -14, -13, -12, -12, -12, -13,
          -14, -15, -16, -16, -16, -15, -15, -14, -14, -15, -15, -16, -16, -16,
          -17, -17, -17, -17, -16, -15, -14, -14, -13, -12, -12, -12, -12, -12,
          -13, -13, -13, -13, -13, -13, -14, -15, -15, -16, -16, -16, -16, -16,
          -15, -14, -13, -13, -13, -13, -13, -14, -14, -13, -13, -13, -13, -14,
          -14, -14, -15, -15, -15, -16, -16, -15, -15, -14, -14, -13, -13, -12,
          -13, -13, -12, -12, -13, -13, -13, -17, -27, -31, -33, -35, -35, -33,
          -31, -28, -26, -27, -29, -32, -35, -36, -38, -40, -43, -45, -48, -50,
          -51, -51, -50, -50, -50, -50, -50, -51, -51, -50, -49, -50, -50, -48,
          -45, -44, -43, -42, -42, -42, -41, -38, -36, -35, -37, -39, -40, -39,
          -36, -33, -33, -34, -65, -70, -70, -71, -72, -66, -57, -61, -58, -57,
          -59, -68, -78, -83, -84, -81, -71, -49, -16, -42, -22, -31, -34, -35,
          -35, -34, -34, -33, -32, -32, -34, -34, -36, -36, -35, -35, -34, -33,
          -33, -33, -32, -31, -32, -33, -34, -35, -36, -37, -38, -37, -36, -35,
          -35, -34, -33, -33, -34, -32, -31, -28, -22, -10, -2, 0, -1, -4, -8,
          -11, -4, 6, 10, 15, 16, 14, 6, 5, 6, 8, 8, 8, 2, -13, -20, -24, -28,
          -30, -32, -33, -34, -33, -34, -34, -34, -34, -34, -34, -33, -33, -34,
          -34, -34, -35, -35, -34, -34, -34, -34, -34, -34, -34, -33, -32, -32,
          -31, -32, -33, -34, -34, -34, -33, -32, -32, -33, -34, -35, -35, -34,
          -31, -27, -23, -18, -18, -19, -19, -19, -19, -19, -18, -18, -17, -17,
          -17, -17, -17, -17, -17, -17, -18, -18, -17, -17, -17, -16, -16, -16,
          -16, -15, -15, -16, -17, -18, -18, -18, -20, -22, -23, -26, -31, -34,
          -35, -34, -35, -34, -31, -28, -15, 0, 6, 8, 8, 0, -6, -7, -12, -19,
          -24, -27, -31, -34, -35, -36, -36, -36, -36, -36, -35, -34, -35, -34,
          -31, -30, -30, -32, -35, -36, -37, -36, -34, -33, -32, -33, -32, -33,
          -33, -34, -36, -37, -36, -36, -36, -36, -36, -35, -35, -35, -36, -36,
          -36, -36, -37, -36, -33, -29, -21, -14, -10, -12, -18, -20, -17, -9,
          -3, 1, -2, -17, -26, -30, -32, -33, -34, -36, -38, -38, -38, -39, -37,
          -34, -36, -29, -27, -25, -25, -24, -23, -23, -24, -23, -22, -25, -28,
          -29, -30, -31, -31, -32, -32, -33, -35, -36, -37, -38, -38, -39, -39,
          -39, -38, -30, -23, -15, -12, -14, -19, -24, -24, -23, -21, -20, -18,
          -17, -18, -21, -22, -25, -26, -24, -23, -22, -20, -20, -19, -18, -16,
          -15, -14, -13, -13, -13, -14, -15, -14, -14, -14, -14, -14, -14, -14,
          -15, -16, -15, -15, -13, -16, -18, -19, -22, -27, -31, -31, -30, -29,
          -29, -29, -25, -11, 9, 25, 27, 16, -4, -21, -25, -24, -28, -29, -29,
          -32, -35, -33, -31, -30, -29, -30, -30, -31, -31, -32, -33, -35, -36,
          -36, -36, -37, -41, -41, -44, -49, -49, -47, -44, -43, -40, -40, -39,
          -37, -35, -34, -35, -36, -37, -36, -34, -32, -30,
        ],
        y: [
          0, -1, -1, -1, -1, 3, 16, 21, 15, 8, 1, -4, -9, -9, -10, -8, -3, 6,
          11, 8, 3, -4, -15, -31, -42, -44, -43, -44, -44, -45, -42, -29, -12,
          -3, 2, -3, -7, -12, -12, -10, -11, -15, -16, -16, -18, -19, -19, -20,
          -22, -25, -26, -28, -28, -26, -19, -13, -5, 5, 27, 38, 37, 34, 35, 35,
          27, 12, -5, -1, 16, 40, 59, 67, 61, 55, 54, 51, 43, 38, 34, 31, 30,
          35, 45, 46, 51, 52, 47, 47, 52, 48, 44, 38, 31, 28, 33, 49, 56, 52,
          48, 40, 29, 19, 16, 18, 19, 19, 18, 19, 20, 21, 22, 22, 23, 22, 22,
          24, 28, 39, 33, 24, 15, 9, 7, 5, 0, -5, -7, -6, -9, -11, -6, 1, 1, -2,
          -5, -5, -6, -6, -5, -5, -6, -6, -6, -7, -6, -4, 4, 11, 9, 8, 9, 7, 5,
          4, 4, 5, 5, 4, 6, 5, 4, 2, 1, 0, -1, -1, 1, 7, 25, 47, 45, 43, 30, 14,
          9, 13, 16, 13, 17, 25, 24, 15, 11, 14, 24, 29, 37, 40, 33, 23, 14, 4,
          1, 13, 41, 50, 52, 53, 50, 45, 40, 38, 39, 46, 49, 48, 59, 61, 63, 60,
          54, 44, 31, 22, 23, 26, 26, 25, 26, 29, 33, 35, 36, 36, 37, 38, 38,
          38, 36, 37, 21, 12, 4, 0, -1, -4, -4, -4, -4, -3, -3, -2, -1, 3, 11,
          16, 12, 7, 2, -4, -9, -12, -13, -13, -14, -13, -10, -2, 17, 24, 26,
          25, 24, 25, 25, 23, 21, 18, 20, 21, 23, 23, 21, 17, 15, 13, 12, 11,
          12, 14, 17, 19, 27, 48, 54, 52, 52, 54, 53, 52, 51, 51, 50, 49, 49,
          49, 48, 50, 65, 71, 66, 50, 33, 22, 23, 35, 62, 66, 62, 58, 55, 49,
          49, 63, 66, 58, 52, 46, 42, 40, 44, 53, 64, 74, 73, 67, 65, 56, 50,
          48, 47, 45, 42, 40, 38, 35, 34, 34, 33, 34, 41, 57, 74, 94, 103, 103,
          103, 92, 77, 70, 64, 60, 57, 52, 43, 37, 31, 30, 30, 31, 31, 31, 31,
          34, 40, 43, 46, 49, 51, 52, 53, 53, 53, 54, 54, 54, 55, 55, 55, 55,
          55, 55, 55, 56, 56, 56, 56, 56, 56, 56, 55, 56, 56, 55, 55, 55, 55,
          55, 55, 56, 56, 56, 56, 56, 56, 55, 55, 54, 54, 54, 54, 54, 54, 54,
          54, 53, 53, 53, 53, 52, 52, 52, 52, 53, 53, 54, 54, 55, 55, 55, 56,
          56, 56, 56, 57, 56, 56, 56, 56, 56, 55, 55, 56, 56, 55, 54, 54, 54,
          54, 54, 53, 52, 50, 48, 31, 24, 16, 10, 7, 7, 10, 17, 22, 24, 23, 25,
          26, 27, 31, 35, 37, 37, 34, 32, 31, 31, 30, 28, 27, 25, 23, 21, 19,
          19, 21, 22, 22, 22, 22, 22, 24, 27, 27, 28, 29, 34, 41, 49, 50, 45,
          39, 37, 37, 37, 37, 34, 57, 59, 60, 60, 63, 75, 85, 89, 87, 82, 81,
          79, 79, 72, 67, 69, 69, 71, 64, 83, 61, 55, 47, 42, 41, 40, 40, 39,
          40, 40, 37, 33, 29, 30, 32, 32, 30, 29, 29, 32, 34, 37, 39, 40, 40,
          41, 43, 46, 44, 40, 36, 33, 31, 30, 27, 22, 15, 12, 10, 9, 18, 32, 37,
          38, 37, 35, 34, 38, 57, 90, 106, 109, 105, 96, 91, 77, 69, 64, 62, 60,
          56, 51, 47, 42, 39, 36, 35, 34, 33, 33, 32, 31, 31, 31, 31, 33, 36,
          37, 38, 38, 38, 39, 40, 43, 45, 43, 40, 37, 36, 36, 38, 40, 39, 38,
          40, 41, 42, 45, 46, 47, 46, 45, 42, 43, 47, 48, 47, 48, 48, 49, 54,
          62, 62, 62, 63, 64, 64, 64, 65, 65, 65, 66, 66, 66, 65, 65, 66, 66,
          65, 66, 67, 67, 67, 67, 67, 67, 67, 67, 67, 68, 69, 72, 78, 73, 73,
          70, 61, 47, 36, 31, 29, 29, 30, 29, 38, 76, 107, 105, 96, 85, 77, 84,
          83, 72, 60, 52, 48, 45, 44, 44, 45, 44, 44, 43, 42, 41, 39, 39, 42,
          47, 49, 49, 44, 39, 37, 38, 38, 38, 37, 39, 38, 37, 37, 38, 38, 40,
          43, 43, 41, 38, 36, 36, 37, 38, 36, 31, 28, 25, 23, 23, 27, 31, 32,
          36, 40, 42, 46, 49, 52, 52, 53, 55, 57, 62, 60, 56, 51, 47, 43, 40,
          38, 36, 34, 32, 33, 33, 34, 36, 52, 59, 54, 48, 45, 43, 45, 48, 48,
          44, 40, 38, 40, 42, 44, 43, 41, 37, 34, 33, 35, 35, 30, 25, 22, 20,
          19, 20, 26, 33, 39, 42, 43, 45, 52, 58, 60, 60, 59, 61, 65, 65, 65,
          65, 62, 59, 58, 56, 55, 54, 53, 53, 54, 53, 53, 54, 57, 58, 61, 65,
          65, 65, 66, 67, 67, 67, 67, 65, 62, 57, 57, 68, 68, 64, 56, 46, 40,
          36, 31, 26, 24, 23, 22, 22, 26, 41, 57, 71, 67, 64, 65, 65, 65, 64,
          57, 52, 52, 53, 51, 51, 51, 51, 50, 49, 49, 50, 50, 50, 49, 48, 48,
          48, 48, 49, 47, 47, 42, 38, 36, 39, 46, 50, 55, 55, 55, 54, 53, 51,
          48, 46, 43, 39, 34, 29, 21,
        ],
      },
      {
        x: [
          0, -1, -2, -2, -4, -5, -5, -7, -8, -10, -10, -10, -7, -6, -4, -4, -4,
          -7, -11, -13, -14, -14, -11, -11, -13, -13, -12, -12, -11, -12, -13,
          -13, -8, -1, 8, 9, 6, 5, 1, 3, 6, 8, 7, 6, 6, 5, 6, 7, 8, 9, 10, 12,
          14, 12, 12, 12, 10, 8, -2, -10, -14, -13, -12, -12, -13, -15, -13,
          -10, -6, -3, -3, -9, -11, -9, -6, -6, -3, 1, 5, 6, 7, 6, 4, 2, 4, 3,
          -1, -5, -8, -6, -4, -2, 0, 0, 1, 3, 2, 3, 4, 3, 3, 4, 5, 4, 5, 4, 4,
          4, 4, 5, 7, 9, 8, 7, 5, 5, 4, 6, 14, 14, 15, 16, 15, 15, 14, 15, 17,
          19, 21, 20, 19, 19, 19, 19, 20, 22, 22, 22, 22, 22, 23, 23, 23, 22,
          20, 18, 14, 16, 17, 16, 18, 20, 22, 21, 20, 20, 20, 21, 22, 22, 24,
          26, 28, 28, 28, 29, 28, 27, 19, -2, -14, -14, -13, -15, -14, -12, -8,
          -8, -9, -9, -7, -7, -7, -7, -6, -6, -6, -7, -7, -8, -9, -10, -9, -6,
          0, 2, 0, -2, -2, -2, -1, 0, -1, -3, -6, -12, -17, -23, -24, -25, -26,
          -27, -28, -29, -27, -26, -24, -22, -21, -20, -18, -16, -15, -14, -14,
          -15, -15, -18, -14, -6, -5, -7, -7, -8, -7, -7, -6, -6, -5, -4, -4,
          -3, -2, -2, -1, 2, 4, 3, 1, -2, -4, -4, -2, -2, -2, -2, -3, -7, -3,
          -2, -3, -5, -7, -6, -6, -7, -8, -7, -2, 1, 2, 4, 6, 9, 10, 11, 12, 12,
          13, 13, 13, 14, 13, -1, -12, -14, -15, -15, -14, -13, -13, -14, -14,
          -14, -14, -14, -14, -14, -14, -14, -10, -4, -2, 0, 1, 1, -1, -4, -1,
          1, 2, -1, -2, -3, 0, 4, 6, 7, 6, 5, 4, 2, 0, -1, -2, -2, -3, -6, -6,
          -6, -6, -7, -8, -9, -10, -12, -12, -10, -9, -8, -8, -8, -12, -16, -21,
          -20, -17, -14, -10, -5, -2, -1, -1, 1, -1, 0, -2, -5, -7, -7, -6, -7,
          -7, -8, -9, -10, -10, -10, -10, -10, -9, -8, -7, -6, -6, -7, -8, -8,
          -8, -8, -8, -7, -6, -6, -6, -6, -7, -7, -7, -8, -8, -9, -9, -9, -8,
          -7, -6, -6, -5, -4, -4, -4, -4, -4, -4, -5, -5, -5, -5, -5, -6, -6,
          -7, -7, -8, -8, -8, -8, -7, -6, -5, -5, -5, -5, -6, -6, -6, -6, -6,
          -6, -6, -6, -7, -7, -7, -8, -8, -9, -9, -9, -8, -8, -7, -7, -6, -6,
          -7, -7, -7, -7, -7, -7, -7, -3, 4, 8, 9, 9, 11, 14, 16, 19, 22, 21,
          19, 16, 13, 12, 11, 8, 6, 4, 2, 0, -2, -2, -1, -1, -2, -4, -6, -7, -8,
          -7, -6, -7, -7, -4, -1, 0, 0, 0, 0, 1, 1, 1, -2, -7, -12, -16, -18,
          -17, -14, -11, -12, -13, -15, -16, -16, -16, -19, -20, -16, -13, -14,
          -16, -17, -16, -12, -11, -9, -7, -9, -13, -15, -12, -7, -1, 1, 3, 4,
          4, 4, 5, 5, 5, 4, 3, 1, 1, 2, 3, 3, 3, 2, 0, 1, 2, 1, 0, 0, 0, -2, -3,
          -4, -3, -3, -3, -3, -3, -3, -3, -3, -1, 0, 1, 1, 3, 3, 1, 0, 0, -1, 0,
          1, 8, 3, 3, 4, 5, -3, -1, 1, 1, 0, 1, 2, 5, 9, 10, 9, 7, 6, 5, 5, 6,
          5, 4, 5, 4, 4, 3, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6,
          6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 3, 0, -3, -5, -6, -5,
          -5, -5, -5, -4, -4, -4, -4, -4, -4, -4, -4, -5, -5, -5, -5, -5, -5,
          -4, -4, -4, -3, -3, -3, -4, -5, -7, -8, -9, -9, -10, -11, -13, -12,
          -11, -9, -8, -8, -7, -6, -8, -11, -11, -14, -13, -8, -4, 1, 8, 12, 12,
          12, 11, 10, 10, 9, 9, 10, 10, 10, 10, 11, 11, 7, 1, 1, -2, -3, -5, -6,
          -6, -6, -5, -3, -3, -4, -5, -4, -4, -4, -5, -7, -7, -7, -7, -8, -8,
          -8, -9, -10, -11, -12, -12, -12, -12, -13, -13, -11, -11, -11, -11,
          -11, -12, -12, -12, -12, -12, -12, -12, -8, -4, 0, 1, 2, 3, 3, 2, -1,
          -1, -2, -4, -6, -8, -8, -9, -10, -9, -8, -8, -8, -8, -7, 2, 9, 12, 17,
          16, 14, 12, 10, 9, 8, 7, 5, 3, 2, 1, -1, -2, -4, -7, -9, -9, -8, -6,
          -6, -5, -3, 2, 6, 9, 7, 5, 4, 2, 3, 6, 9, 11, 12, 14, 15, 16, 17, 17,
          17, 17, 18, 18, 18, 17, 15, 12, 6, 2, 1, 0, 0, 0, 0, -1, -1, -2, -4,
          -5, -10, -8, -11, -10, -8, -8, -10, -12, -13, -12, -12, -11, -11, -9,
          0, 13, 25, 27, 20, 9, 3, 2, 4, 5, 8, 9, 6, 3, 6, 8, 8, 9, 9, 8, 7, 7,
          6, 5, 2, 1, 1, 1, -1, -7, -8, -13, -22, -24, -22, -18, -15, -12, -12,
          -12, -10, -9, -9, -11, -13, -14, -14, -13, -12, -10,
        ],
        y: [
          0, -1, -1, -1, -1, 3, 20, 28, 22, 14, 6, 1, -4, -5, -10, -12, -13, -8,
          -5, -7, -9, -12, -16, -24, -29, -31, -32, -34, -36, -37, -36, -36,
          -32, -26, -4, 4, 3, 0, -3, -5, -6, -9, -8, -2, 2, 0, -4, -6, -8, -10,
          -11, -12, -12, -11, -8, -5, 1, 13, 35, 47, 45, 42, 42, 37, 28, 18, 8,
          5, 11, 36, 67, 83, 75, 65, 62, 46, 31, 24, 20, 20, 19, 22, 29, 35, 50,
          64, 59, 56, 59, 44, 39, 35, 31, 29, 30, 37, 41, 36, 30, 28, 28, 22,
          20, 21, 22, 22, 22, 22, 22, 24, 27, 28, 30, 30, 30, 32, 34, 46, 35,
          30, 23, 19, 19, 17, 13, 10, 9, 9, 7, 6, 7, 11, 11, 11, 10, 11, 11, 11,
          12, 12, 11, 11, 11, 12, 14, 16, 24, 31, 32, 29, 27, 22, 20, 19, 20,
          24, 28, 28, 24, 20, 17, 14, 14, 15, 14, 14, 14, 18, 35, 65, 61, 61,
          41, 20, 11, 16, 23, 22, 31, 39, 32, 25, 22, 25, 33, 38, 41, 44, 42,
          36, 31, 22, 12, 14, 36, 51, 56, 56, 50, 43, 38, 36, 40, 57, 65, 63,
          75, 66, 63, 58, 54, 50, 44, 40, 41, 43, 40, 38, 39, 42, 45, 47, 48,
          49, 50, 50, 50, 51, 54, 54, 40, 34, 28, 26, 25, 23, 22, 22, 22, 22,
          23, 23, 25, 26, 27, 26, 23, 20, 18, 15, 14, 14, 14, 14, 15, 16, 17,
          22, 31, 41, 44, 43, 39, 39, 36, 34, 35, 36, 42, 43, 44, 40, 37, 33,
          31, 30, 30, 30, 31, 32, 34, 36, 45, 65, 72, 69, 70, 71, 70, 68, 67,
          66, 65, 65, 64, 64, 64, 68, 76, 69, 61, 45, 37, 33, 32, 37, 49, 55,
          53, 58, 61, 57, 57, 66, 63, 53, 47, 43, 43, 44, 45, 50, 66, 87, 89,
          82, 80, 63, 57, 55, 54, 54, 54, 54, 52, 51, 49, 42, 40, 42, 45, 54,
          74, 106, 126, 129, 122, 107, 78, 64, 56, 51, 50, 47, 44, 43, 40, 40,
          40, 41, 42, 42, 43, 46, 55, 60, 63, 65, 66, 67, 67, 67, 67, 68, 68,
          68, 68, 68, 68, 68, 69, 69, 69, 69, 70, 70, 69, 69, 69, 69, 69, 69,
          69, 69, 69, 69, 69, 69, 69, 70, 70, 70, 70, 69, 69, 69, 68, 68, 68,
          67, 67, 67, 67, 67, 67, 67, 67, 67, 66, 65, 66, 66, 66, 66, 67, 68,
          68, 69, 69, 69, 70, 70, 70, 70, 71, 71, 70, 70, 70, 70, 70, 70, 70,
          71, 71, 70, 70, 70, 70, 70, 69, 68, 68, 72, 51, 43, 38, 34, 33, 33,
          35, 37, 40, 41, 43, 46, 48, 49, 52, 55, 56, 57, 55, 53, 52, 52, 52,
          52, 51, 50, 49, 48, 46, 46, 48, 48, 48, 47, 47, 46, 47, 48, 49, 49,
          49, 50, 52, 52, 52, 49, 47, 46, 46, 45, 46, 45, 43, 42, 42, 39, 41,
          38, 43, 58, 64, 67, 65, 59, 55, 50, 45, 45, 52, 82, 91, 101, 78, 65,
          57, 53, 51, 50, 49, 48, 49, 50, 50, 49, 49, 50, 50, 49, 48, 46, 45,
          44, 46, 48, 50, 51, 51, 51, 52, 54, 53, 51, 49, 47, 45, 44, 43, 41,
          39, 36, 34, 31, 25, 28, 35, 39, 37, 37, 37, 41, 52, 82, 111, 118, 115,
          103, 103, 78, 65, 59, 57, 59, 60, 62, 59, 54, 51, 50, 50, 50, 51, 51,
          51, 50, 49, 48, 47, 47, 48, 49, 50, 51, 51, 51, 52, 53, 54, 54, 53,
          52, 51, 51, 52, 54, 53, 52, 52, 52, 52, 52, 53, 53, 53, 54, 55, 57,
          60, 62, 63, 65, 64, 66, 70, 75, 75, 76, 78, 79, 80, 81, 81, 81, 82,
          82, 83, 83, 81, 82, 82, 82, 81, 82, 82, 82, 82, 82, 82, 83, 83, 83,
          83, 83, 85, 90, 91, 76, 75, 73, 67, 59, 52, 46, 43, 42, 42, 42, 47,
          61, 91, 102, 94, 80, 67, 69, 71, 67, 62, 59, 58, 57, 58, 60, 62, 62,
          62, 61, 60, 60, 59, 59, 60, 62, 65, 66, 64, 60, 58, 57, 56, 55, 54,
          52, 52, 51, 51, 50, 50, 49, 50, 50, 50, 50, 48, 48, 48, 48, 47, 46,
          43, 41, 39, 37, 35, 33, 32, 33, 41, 45, 44, 44, 44, 44, 47, 53, 57,
          64, 68, 64, 60, 58, 57, 57, 56, 56, 55, 54, 54, 53, 51, 51, 52, 50,
          46, 42, 41, 39, 42, 48, 55, 55, 52, 54, 55, 55, 57, 57, 56, 54, 53,
          53, 53, 54, 53, 50, 48, 44, 41, 41, 44, 53, 59, 62, 62, 62, 65, 68,
          70, 72, 76, 81, 86, 84, 85, 83, 80, 78, 76, 75, 74, 73, 73, 74, 75,
          75, 75, 76, 79, 81, 84, 87, 90, 91, 91, 92, 92, 92, 92, 91, 90, 90,
          92, 101, 82, 82, 75, 66, 61, 59, 53, 49, 46, 41, 37, 33, 31, 34, 43,
          65, 80, 82, 81, 82, 80, 79, 78, 74, 75, 76, 76, 75, 74, 73, 72, 71,
          71, 72, 72, 73, 72, 72, 72, 72, 73, 74, 75, 75, 74, 74, 75, 76, 78,
          80, 80, 80, 80, 80, 78, 75, 72, 69, 67, 63, 60, 55, 47,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -4, -5, -8, -8, -7, -8, -7, -6, -3, -2, 0, 1, 0, -1,
          -4, -6, -6, -5, -1, 0, -1, -1, 0, 1, 3, 2, 2, 3, 7, 8, 11, 9, 6, 10,
          17, 22, 26, 29, 27, 23, 23, 25, 28, 31, 34, 35, 36, 38, 39, 37, 37,
          35, 29, 19, -1, -14, -20, -19, -16, -14, -15, -16, -11, -7, -4, -8,
          -17, -37, -40, -49, -17, -12, -4, 3, 11, 13, 14, 11, 6, 2, -2, -8,
          -13, -14, -11, -6, -4, 0, 3, 5, 3, 3, 1, 2, 4, 5, 7, 9, 10, 10, 10,
          10, 9, 9, 9, 9, 9, 10, 9, 8, 7, 6, 6, 7, 22, 30, 33, 34, 34, 33, 33,
          35, 36, 38, 41, 41, 40, 40, 41, 42, 43, 44, 44, 45, 44, 45, 45, 45,
          45, 45, 43, 40, 31, 26, 25, 26, 32, 38, 40, 40, 39, 36, 33, 31, 32,
          37, 41, 43, 45, 46, 46, 47, 46, 44, 29, 3, -11, -11, -10, -10, -10,
          -9, -11, -14, -11, -8, -3, 1, 2, 2, 1, 1, 0, -1, -1, -2, -3, -2, -2,
          -3, -4, -9, -13, -12, -6, -2, 1, 3, 1, -7, -15, -21, -24, -25, -25,
          -26, -26, -27, -27, -27, -26, -24, -21, -18, -17, -16, -15, -14, -14,
          -14, -14, -14, -14, -15, -5, 10, 16, 18, 19, 20, 21, 21, 22, 22, 22,
          23, 23, 24, 24, 24, 25, 26, 26, 24, 21, 19, 18, 18, 19, 20, 20, 20,
          20, 12, 7, 0, -7, -9, -7, 0, 3, 3, 2, 0, -3, -4, -3, 9, 20, 25, 28,
          29, 30, 31, 31, 31, 31, 31, 25, 3, -13, -17, -17, -16, -15, -14, -14,
          -15, -15, -15, -15, -15, -15, -16, -16, -17, -10, -2, 5, 7, 10, 10, 4,
          1, 2, 0, -2, -7, -11, -12, -4, 4, 9, 10, 10, 9, 8, 5, -3, -11, -15,
          -14, -13, -9, -5, -3, -3, -3, -4, -5, -6, -7, -6, 1, 3, 4, 4, 1, -8,
          -19, -23, -25, -21, -16, -5, 1, 5, 6, 7, 9, 10, 12, 10, 8, 6, 5, 6, 5,
          4, 0, -3, -6, -7, -7, -7, -7, -6, -5, -4, -3, -3, -4, -4, -4, -4, -3,
          -3, -2, -1, 0, 0, 0, -1, -1, -2, -2, -2, -3, -3, -2, -1, -1, 0, 0, 1,
          2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, -1, -1, -2, -2, -2, -2, -2, -1, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -2, -2, -2, -3, -4, -4, -3,
          -3, -3, -2, -2, -2, -3, -4, -4, -4, -4, -4, -4, -3, 9, 25, 33, 37, 39,
          41, 43, 45, 46, 47, 47, 46, 44, 42, 41, 40, 38, 36, 34, 32, 30, 28,
          28, 29, 29, 27, 25, 24, 22, 22, 23, 23, 23, 23, 24, 27, 28, 27, 27,
          27, 27, 27, 25, 18, 10, 4, 0, -2, -1, 1, 3, 3, 2, 0, -1, 0, 0, -4,
          -12, -17, -23, -30, -35, -62, -60, -57, -52, -57, -55, -57, -70, -57,
          -54, -23, 7, 22, 24, 26, 26, 26, 26, 26, 27, 26, 26, 25, 25, 26, 26,
          26, 25, 22, 19, 19, 20, 21, 21, 21, 21, 20, 19, 18, 18, 18, 18, 17,
          17, 18, 17, 18, 19, 21, 22, 18, 12, 4, -1, -1, -1, 1, 5, 3, -7, -15,
          -17, -17, -15, -7, -3, -2, -1, -3, -4, 3, 20, 30, 34, 34, 33, 32, 32,
          32, 33, 32, 32, 31, 31, 30, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29,
          29, 30, 30, 31, 31, 31, 32, 32, 32, 32, 32, 32, 31, 32, 32, 32, 31,
          32, 33, 33, 33, 32, 31, 27, 22, 16, 8, 5, 5, 5, 6, 6, 5, 6, 6, 5, 4,
          4, 4, 4, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 2, 0, -3, -6, -2,
          -3, -2, -1, 6, 9, 13, 14, 14, 14, 14, 11, -1, -10, -18, -20, -16, -6,
          7, 19, 29, 32, 33, 35, 36, 37, 38, 38, 39, 39, 40, 40, 40, 40, 35, 26,
          21, 17, 16, 16, 16, 18, 18, 18, 18, 18, 16, 16, 17, 17, 17, 16, 14,
          13, 14, 13, 12, 12, 12, 11, 11, 9, 8, 8, 9, 9, 8, 8, 9, 8, 2, -5, -8,
          -8, -4, -2, -4, -9, -16, -20, -13, 5, 15, 20, 22, 24, 25, 25, 23, 22,
          21, 19, 14, 9, 15, 11, 7, 9, 10, 11, 11, 10, 13, 23, 32, 34, 39, 39,
          38, 36, 34, 32, 31, 30, 29, 27, 26, 25, 23, 23, 22, 19, 16, 8, 3, 0,
          -1, 0, 7, 17, 23, 25, 23, 18, 15, 12, 13, 16, 20, 25, 27, 28, 29, 30,
          31, 31, 30, 30, 30, 30, 29, 27, 25, 20, 13, 8, 5, 4, 4, 3, 3, 2, 2, 1,
          -1, -3, -8, -7, -9, -6, 0, 2, 2, 2, 2, 3, 3, 3, 5, 7, 14, 19, 16, 16,
          12, 13, 17, 17, 19, 22, 23, 24, 21, 19, 21, 23, 24, 24, 24, 23, 22,
          22, 21, 20, 19, 18, 18, 18, 16, 11, 10, 6, -2, -5, -3, -1, 0, 1, 1, 1,
          2, 3, 2, 0, -2, -4, -5, -4, 26, 32,
        ],
        y: [
          0, -1, -1, -1, -1, 4, 18, 21, 15, 7, -1, -6, -11, -12, -15, -15, -10,
          -1, 4, 3, 0, -3, -11, -22, -28, -29, -29, -30, -31, -31, -28, -22,
          -15, -8, 1, 1, -1, -7, -8, -8, -10, -14, -13, -9, -10, -13, -16, -17,
          -21, -23, -25, -26, -26, -24, -20, -14, -4, 11, 35, 44, 45, 45, 45,
          43, 40, 32, 22, 21, 28, 48, 71, 66, 59, 49, 57, 48, 40, 33, 27, 25,
          24, 30, 39, 42, 51, 57, 53, 50, 53, 44, 41, 37, 31, 28, 32, 43, 50,
          46, 42, 37, 32, 22, 19, 20, 21, 21, 21, 21, 21, 22, 25, 25, 26, 27,
          27, 28, 31, 42, 30, 24, 16, 10, 8, 6, 2, -2, -5, -6, -10, -13, -9, -4,
          -4, -5, -8, -8, -10, -11, -10, -10, -9, -9, -8, -6, -1, 3, 13, 17, 14,
          12, 11, 7, 5, 5, 6, 9, 11, 10, 9, 6, 2, -1, -2, -3, -4, -3, -3, 2, 18,
          49, 49, 50, 39, 26, 20, 21, 25, 23, 29, 34, 27, 19, 16, 19, 25, 30,
          36, 41, 38, 33, 26, 13, 10, 17, 36, 46, 49, 49, 45, 39, 34, 32, 34,
          46, 52, 50, 61, 59, 59, 56, 51, 45, 36, 32, 35, 36, 33, 31, 31, 34,
          36, 38, 39, 40, 41, 41, 41, 42, 40, 36, 19, 12, 6, 2, 1, -1, -2, -3,
          -3, -2, -2, -1, 0, 2, 6, 7, 5, 2, 0, -4, -7, -8, -8, -8, -7, -5, -3,
          3, 14, 20, 22, 23, 23, 28, 27, 26, 25, 25, 24, 21, 23, 22, 20, 15, 12,
          10, 9, 8, 8, 9, 12, 14, 22, 45, 56, 55, 56, 58, 56, 55, 54, 54, 53,
          53, 52, 52, 52, 55, 66, 67, 56, 39, 25, 18, 17, 27, 49, 56, 52, 53,
          52, 49, 49, 57, 51, 40, 32, 28, 27, 26, 29, 38, 55, 72, 73, 66, 63,
          50, 44, 43, 43, 41, 40, 39, 38, 37, 35, 37, 35, 36, 41, 55, 74, 99,
          105, 106, 101, 94, 73, 62, 55, 51, 49, 43, 38, 35, 32, 33, 34, 35, 36,
          37, 38, 42, 50, 54, 56, 58, 59, 60, 60, 59, 59, 60, 60, 60, 60, 60,
          60, 61, 61, 61, 61, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62, 62,
          62, 62, 62, 62, 62, 63, 63, 63, 62, 62, 62, 61, 61, 61, 60, 60, 60,
          60, 60, 60, 60, 59, 59, 59, 59, 59, 59, 59, 60, 60, 61, 61, 62, 62,
          62, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 64, 64, 63,
          63, 64, 64, 63, 63, 62, 61, 61, 42, 32, 25, 19, 17, 17, 19, 25, 29,
          30, 30, 31, 32, 33, 36, 39, 39, 39, 37, 35, 34, 34, 34, 33, 33, 32,
          30, 27, 26, 25, 26, 27, 28, 28, 28, 28, 29, 31, 31, 32, 32, 34, 39,
          45, 47, 45, 44, 43, 43, 44, 45, 45, 43, 42, 41, 38, 37, 42, 54, 67,
          73, 74, 67, 61, 55, 48, 42, 41, 51, 86, 59, 72, 77, 64, 49, 44, 42,
          41, 40, 39, 39, 38, 36, 31, 30, 30, 31, 31, 29, 31, 32, 35, 37, 38,
          39, 38, 38, 38, 39, 42, 40, 38, 35, 33, 34, 34, 33, 30, 28, 25, 23,
          19, 24, 34, 42, 45, 44, 42, 42, 45, 57, 93, 110, 114, 112, 103, 92,
          74, 65, 60, 59, 60, 58, 51, 45, 38, 35, 33, 32, 32, 31, 32, 32, 32,
          31, 29, 28, 29, 31, 32, 33, 34, 34, 34, 35, 37, 38, 36, 35, 33, 32,
          32, 34, 36, 35, 35, 35, 36, 37, 39, 39, 40, 40, 40, 39, 39, 42, 43,
          45, 48, 49, 53, 58, 63, 65, 67, 69, 69, 70, 71, 71, 71, 71, 72, 73,
          73, 72, 72, 73, 73, 73, 73, 73, 73, 73, 73, 74, 74, 74, 74, 74, 75,
          76, 79, 82, 69, 69, 68, 61, 49, 37, 30, 27, 27, 27, 27, 36, 71, 106,
          106, 97, 86, 72, 72, 70, 61, 54, 48, 45, 42, 42, 43, 44, 43, 43, 43,
          42, 42, 42, 45, 49, 51, 54, 53, 48, 42, 38, 38, 38, 38, 37, 38, 38,
          37, 36, 36, 36, 37, 39, 38, 36, 35, 33, 33, 33, 34, 31, 29, 26, 22,
          18, 17, 16, 18, 20, 28, 40, 45, 45, 45, 44, 45, 50, 53, 55, 61, 56,
          49, 44, 40, 38, 36, 34, 33, 31, 30, 30, 30, 27, 35, 45, 54, 50, 45,
          42, 41, 44, 49, 49, 42, 38, 38, 38, 41, 44, 43, 42, 41, 39, 40, 41,
          42, 40, 37, 33, 30, 29, 32, 43, 51, 55, 57, 58, 58, 60, 62, 64, 66,
          69, 72, 75, 71, 68, 64, 59, 54, 53, 52, 51, 51, 51, 52, 54, 54, 54,
          56, 59, 61, 65, 71, 75, 78, 79, 80, 81, 81, 81, 80, 79, 78, 78, 85,
          73, 72, 68, 59, 53, 49, 41, 34, 30, 27, 23, 21, 22, 32, 44, 62, 68,
          66, 64, 64, 64, 62, 56, 52, 51, 52, 50, 50, 49, 48, 47, 46, 46, 47,
          47, 48, 48, 47, 47, 47, 48, 49, 51, 52, 53, 56, 57, 57, 58, 58, 58,
          58, 58, 57, 56, 53, 50, 47, 45, 44, 40, 36, 27,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -4, -7, -16, -20, -15, -11, -7, -5, -2, -2, -3, -11,
          -24, -28, -30, -29, -26, -22, -18, -13, -12, -11, -10, -8, -7, -7, -8,
          -13, -14, -12, -7, -6, -8, 1, 10, 14, 20, 24, 20, 14, 16, 19, 24, 32,
          37, 40, 43, 46, 47, 44, 37, 29, 18, 8, -7, -17, -20, -17, -14, -17,
          -20, -15, -8, -11, -17, -23, -28, -34, -36, -35, -31, -23, -16, -10,
          -4, -2, -2, -6, -14, -16, -21, -26, -30, -29, -22, -20, -17, -11, -4,
          -1, -9, -20, -23, -23, -21, -12, -3, 0, 3, 4, 4, 4, 4, 3, 3, 2, 0, -1,
          0, -1, -1, -1, 0, -1, 10, 19, 22, 23, 23, 22, 24, 29, 33, 36, 42, 43,
          42, 40, 41, 43, 46, 51, 53, 54, 53, 53, 54, 53, 53, 52, 46, 38, 27,
          20, 20, 23, 29, 34, 36, 36, 34, 29, 25, 24, 25, 29, 36, 41, 44, 46,
          48, 48, 46, 40, 18, -2, -11, -12, -13, -18, -21, -22, -22, -22, -13,
          -6, -5, -2, -1, -1, -2, -3, -9, -8, -6, -3, -3, -7, -12, -20, -30,
          -34, -36, -33, -23, -18, -15, -13, -13, -20, -27, -31, -34, -39, -44,
          -45, -42, -38, -34, -30, -26, -25, -22, -20, -19, -18, -17, -15, -16,
          -16, -16, -16, -16, -16, -8, 5, 18, 24, 28, 32, 35, 37, 38, 37, 38,
          38, 38, 39, 39, 36, 31, 27, 25, 17, 15, 13, 13, 13, 16, 17, 17, 16,
          15, 6, -2, -9, -16, -17, -8, -2, -2, -3, -4, -6, -10, -14, -11, 6, 18,
          26, 31, 34, 35, 36, 36, 35, 36, 35, 23, 3, -8, -12, -11, -9, -8, -8,
          -8, -8, -8, -9, -8, -8, -9, -9, -19, -30, -27, -21, -12, -4, -3, -11,
          -22, -24, -20, -18, -21, -25, -29, -32, -24, -14, -11, -9, -6, -5, -9,
          -15, -21, -24, -24, -23, -19, -15, -12, -11, -10, -10, -9, -8, -9,
          -10, -10, -13, -12, -12, -15, -24, -31, -35, -41, -41, -39, -35, -31,
          -27, -26, -25, -23, -19, -13, -7, -7, -8, -9, -9, -9, -9, -10, -12,
          -13, -14, -14, -14, -14, -13, -12, -10, -9, -8, -8, -8, -8, -9, -9,
          -8, -8, -7, -6, -6, -6, -6, -6, -7, -7, -7, -8, -8, -8, -8, -7, -6,
          -5, -5, -4, -3, -3, -3, -3, -3, -4, -4, -4, -4, -4, -4, -5, -6, -6,
          -7, -7, -7, -7, -7, -6, -5, -5, -5, -5, -6, -6, -6, -6, -7, -6, -7,
          -7, -7, -8, -8, -8, -7, -9, -9, -11, -10, -9, -8, -8, -8, -9, -11,
          -12, -12, -12, -12, -11, -11, -9, 3, 19, 28, 34, 40, 49, 52, 50, 43,
          39, 38, 36, 36, 36, 36, 35, 34, 33, 32, 31, 29, 29, 29, 30, 31, 30,
          29, 28, 27, 26, 25, 25, 25, 25, 27, 29, 29, 28, 28, 28, 29, 29, 23,
          10, -6, -11, -12, -11, -9, -7, -8, -8, -8, -9, -10, -10, -10, -11,
          -18, -22, -27, -31, -34, -33, -25, -14, -9, -8, -7, -8, -15, -20, -14,
          0, 10, 15, 18, 19, 19, 18, 18, 16, 16, 18, 19, 20, 21, 22, 21, 21, 20,
          13, 5, 5, 5, 7, 8, 10, 11, 10, 8, 8, 8, 10, 10, 9, 7, 4, 3, 4, 5, 4,
          2, -6, -14, -20, -23, -22, -19, -16, -12, -19, -26, -31, -32, -30,
          -28, -24, -25, -27, -30, -32, -32, -17, 6, 19, 24, 26, 28, 29, 30, 31,
          32, 32, 32, 32, 30, 27, 20, 20, 20, 21, 22, 23, 24, 24, 21, 21, 22,
          25, 27, 30, 30, 28, 29, 30, 29, 27, 26, 24, 23, 22, 22, 22, 23, 26,
          29, 28, 29, 29, 26, 19, 15, 10, 4, 2, 2, 2, 3, 3, 4, 4, 4, 4, 3, 3, 2,
          2, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 2, 0, -3, -7, -14, -24, -29,
          -31, -30, -26, -14, -6, -2, -3, -3, -3, -6, -13, -32, -42, -46, -47,
          -41, -28, -20, -9, 3, 14, 21, 28, 32, 36, 39, 41, 43, 44, 44, 44, 45,
          43, 35, 21, 17, 16, 9, 7, 7, 8, 8, 8, 8, 6, 0, -1, -1, 0, 0, -1, -4,
          -6, -6, -7, -6, -4, -5, -7, -10, -11, -12, -12, -13, -13, -15, -18,
          -18, -17, -20, -23, -24, -26, -27, -28, -31, -36, -41, -44, -32, -10,
          3, 11, 17, 21, 26, 30, 30, 30, 28, 23, 12, -1, -10, -25, -34, -33,
          -30, -27, -25, -22, -13, 3, 12, 21, 30, 31, 27, 25, 21, 19, 20, 21,
          21, 18, 15, 9, 5, 1, -2, -6, -9, -13, -17, -19, -19, -14, -5, 1, 5, 6,
          4, -2, 1, 4, 6, 12, 17, 26, 29, 29, 30, 30, 29, 29, 28, 26, 26, 26,
          24, 21, 19, 14, 8, 3, 1, 0, 0, -1, -1, -2, -2, -3, -4, -11, -23, -32,
          -29, -19, -12, -9, -9, -12, -13, -14, -16, -17, -18, -18, -15, -13,
          -14, -10, -5, 2, 5, 3, 5, 13, 15, 19, 19, 19, 20, 21, 20, 20, 21, 21,
          21, 20, 19, 20, 19, 18, 18, 18, 16, 13, 12, 9, 2, -1, -1, -1, -1, -1,
          -2, -2, -2, -2, -4, -6, -8, -10, -12, -13, -15, -18,
        ],
        y: [
          0, -1, -1, -1, -1, 3, 17, 22, 19, 13, 7, 4, 0, 0, 0, 5, 25, 44, 50,
          46, 37, 24, 10, -4, -11, -12, -12, -13, -12, -11, -1, 16, 25, 20, -3,
          -21, -25, -30, -23, -12, -13, -19, -24, -29, -38, -41, -35, -31, -33,
          -37, -41, -45, -48, -42, -29, -17, -3, 6, 21, 26, 28, 31, 36, 42, 47,
          37, 27, 30, 46, 57, 57, 52, 48, 43, 46, 52, 53, 50, 45, 41, 40, 46,
          60, 59, 53, 47, 42, 43, 49, 55, 52, 45, 36, 33, 41, 66, 78, 74, 69,
          54, 40, 28, 25, 26, 27, 27, 26, 26, 26, 27, 26, 24, 25, 25, 25, 26,
          28, 35, 33, 25, 13, 2, -5, -9, -14, -21, -27, -29, -35, -36, -24, -11,
          -10, -17, -25, -32, -37, -40, -40, -40, -39, -38, -36, -31, -20, -10,
          -11, -16, -23, -20, -16, -14, -12, -11, -12, -15, -18, -20, -16, -12,
          -13, -17, -20, -23, -25, -24, -20, -11, 10, 34, 36, 36, 39, 38, 38,
          38, 35, 31, 32, 35, 36, 32, 29, 30, 33, 37, 52, 56, 51, 45, 40, 34,
          26, 35, 57, 59, 58, 59, 61, 59, 56, 54, 51, 47, 43, 43, 57, 76, 84,
          81, 70, 57, 45, 37, 36, 38, 37, 36, 36, 37, 38, 38, 38, 38, 39, 39,
          39, 38, 24, 11, -1, -8, -16, -22, -25, -28, -28, -28, -28, -28, -27,
          -27, -26, -19, -8, -2, -5, 0, -12, -18, -21, -22, -23, -22, -19, -14,
          -7, 5, 12, 8, 7, 7, 12, 23, 30, 32, 31, 23, 12, 8, 8, 8, 5, -1, -6,
          -9, -10, -10, -5, -5, -2, -3, 7, 32, 42, 43, 47, 51, 51, 50, 49, 49,
          48, 47, 47, 47, 46, 49, 65, 90, 87, 67, 48, 38, 38, 48, 76, 80, 72,
          62, 55, 48, 48, 64, 67, 62, 57, 51, 46, 43, 45, 56, 66, 64, 59, 53,
          51, 52, 52, 51, 51, 48, 45, 41, 38, 37, 36, 47, 46, 47, 54, 76, 89,
          86, 83, 81, 81, 86, 93, 96, 95, 94, 90, 77, 60, 51, 44, 45, 46, 46,
          46, 46, 47, 48, 50, 51, 52, 53, 54, 54, 55, 54, 54, 54, 55, 55, 55,
          56, 56, 56, 57, 57, 57, 57, 58, 58, 58, 58, 58, 58, 57, 58, 58, 58,
          57, 57, 57, 57, 57, 58, 58, 58, 58, 58, 58, 57, 57, 56, 56, 56, 56,
          56, 56, 57, 56, 56, 55, 55, 55, 55, 55, 55, 55, 55, 56, 57, 57, 58,
          58, 58, 58, 59, 59, 59, 59, 57, 58, 57, 59, 59, 56, 56, 57, 57, 58,
          58, 59, 60, 60, 59, 59, 57, 55, 43, 37, 31, 20, 9, 0, -4, -2, 4, 12,
          14, 19, 22, 23, 27, 33, 36, 34, 31, 28, 26, 24, 23, 22, 22, 21, 19,
          14, 8, 5, 4, 4, 3, 4, 4, 4, 6, 10, 11, 10, 10, 11, 19, 36, 59, 62, 56,
          50, 45, 44, 49, 51, 49, 49, 51, 52, 52, 54, 60, 63, 62, 59, 54, 54,
          55, 53, 46, 49, 48, 45, 43, 40, 51, 63, 61, 54, 48, 45, 45, 44, 43,
          43, 38, 29, 22, 17, 16, 16, 18, 18, 18, 27, 46, 47, 44, 41, 38, 35,
          35, 41, 46, 43, 37, 32, 29, 30, 34, 36, 40, 42, 45, 48, 51, 62, 68,
          66, 65, 63, 60, 60, 63, 77, 86, 89, 89, 86, 83, 83, 83, 84, 83, 82,
          80, 67, 50, 38, 28, 23, 18, 16, 14, 12, 11, 12, 12, 11, 12, 17, 29,
          32, 31, 30, 28, 26, 26, 30, 40, 41, 35, 29, 22, 17, 18, 25, 26, 24,
          21, 21, 19, 21, 23, 24, 24, 24, 23, 24, 32, 42, 40, 33, 30, 32, 33,
          39, 48, 51, 53, 55, 54, 55, 56, 56, 57, 57, 58, 59, 59, 58, 58, 58,
          58, 58, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59, 61, 63, 69, 77, 86,
          89, 89, 82, 58, 38, 30, 29, 31, 34, 41, 57, 89, 113, 100, 90, 82, 80,
          89, 82, 66, 53, 44, 37, 33, 32, 30, 29, 28, 27, 26, 26, 26, 27, 34,
          45, 43, 39, 36, 29, 22, 17, 18, 20, 21, 24, 44, 45, 43, 41, 40, 41,
          48, 55, 53, 50, 46, 42, 42, 47, 52, 52, 52, 53, 54, 56, 60, 69, 74,
          71, 70, 68, 68, 74, 85, 90, 88, 83, 76, 75, 76, 71, 59, 48, 40, 31,
          23, 18, 15, 12, 13, 16, 25, 40, 51, 81, 97, 93, 88, 83, 80, 77, 69,
          52, 54, 46, 16, 16, 25, 31, 33, 30, 26, 22, 22, 26, 29, 34, 39, 41,
          45, 50, 54, 56, 56, 55, 54, 53, 54, 65, 72, 72, 69, 101, 82, 55, 48,
          42, 36, 30, 27, 26, 25, 24, 24, 24, 25, 26, 26, 26, 29, 32, 34, 43,
          53, 61, 65, 67, 69, 70, 70, 70, 70, 70, 70, 73, 89, 99, 96, 87, 79,
          75, 73, 74, 72, 70, 70, 70, 72, 76, 82, 82, 79, 65, 56, 56, 60, 64,
          60, 45, 48, 39, 37, 36, 37, 35, 34, 32, 32, 31, 32, 31, 31, 30, 29,
          29, 29, 29, 31, 34, 34, 36, 43, 45, 45, 45, 46, 45, 45, 45, 44, 43,
          40, 37, 34, 32, 28, 25, 20, 13,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -4, -4, -2, -5, -9, -13, -13, -14, -14, -13, -11, -10,
          -13, -14, -13, -13, -15, -19, -26, -28, -30, -29, -27, -25, -24, -24,
          -24, -22, -20, -14, -7, -7, -10, -13, -23, -25, -23, -23, -25, -18,
          -16, -18, -23, -23, -24, -25, -25, -23, -23, -23, -22, -22, -17, -3,
          2, -1, -4, -5, -6, -11, -23, -18, -15, -17, -20, -12, -1, 1, 2, 4, 2,
          -9, -14, -16, -15, -13, -13, -16, -20, -20, -6, 7, 7, 3, -7, -14, -13,
          -10, -9, -9, -7, -10, -10, -9, -13, -12, -9, -12, -13, -13, -14, -14,
          -14, -14, -13, -7, 6, 10, 7, 5, 3, 2, 1, 1, -10, -19, -16, -18, -21,
          -15, -14, -16, -16, -17, -19, -19, -19, -18, -17, -17, -16, -20, -20,
          -20, -20, -19, -19, -18, -16, -15, -15, -15, -15, -11, -10, -11, -14,
          -13, -11, -12, -13, -8, -1, 2, 0, -9, -11, -10, -10, -9, -8, -8, -8,
          -8, -6, -6, -11, -15, -19, -21, -19, -11, -4, -5, -12, -19, -25, -27,
          -27, -26, -27, -25, -21, -19, -19, -17, -16, -15, -12, -4, 4, 9, 8, 1,
          -9, -13, -13, -12, -8, 1, 4, 1, -9, -23, -28, -27, -24, -21, -25, -28,
          -33, -36, -36, -35, -33, -31, -27, -24, -20, -19, -19, -20, -20, -22,
          -21, -24, -31, -35, -37, -39, -42, -43, -43, -43, -41, -40, -39, -39,
          -39, -38, -36, -33, -30, -25, -30, -31, -31, -31, -30, -29, -30, -30,
          -30, -30, -20, -10, -5, -4, -10, -19, -24, -23, -16, -3, 5, 8, 6, -10,
          -22, -24, -23, -23, -23, -22, -21, -20, -18, -16, -9, -4, -9, -12,
          -13, -13, -14, -14, -15, -16, -17, -18, -18, -18, -18, -18, -20, -29,
          -30, -25, -15, -4, -5, -6, -11, -13, -9, -1, 2, 2, 2, 1, -8, -16, -18,
          -17, -14, -13, -14, -13, -10, -2, 1, 1, -3, -13, -22, -27, -28, -28,
          -29, -30, -31, -34, -33, -34, -33, -33, -34, -34, -25, -15, -12, -11,
          -12, -18, -23, -21, -17, -15, -16, -26, -17, -24, -25, -25, -26, -27,
          -26, -26, -25, -18, -10, -7, -6, -7, -7, -8, -7, -4, -4, -4, -4, -5,
          -6, -7, -8, -8, -8, -8, -7, -7, -7, -7, -8, -8, -9, -9, -9, -10, -10,
          -9, -9, -8, -7, -7, -6, -5, -5, -5, -5, -5, -5, -6, -6, -6, -6, -6,
          -7, -8, -8, -9, -9, -9, -9, -9, -8, -7, -6, -6, -6, -7, -7, -7, -7,
          -7, -7, -7, -7, -7, -8, -8, -8, -8, -9, -9, -9, -9, -9, -8, -7, -7,
          -7, -8, -9, -10, -10, -10, -10, -10, -8, -10, -16, -19, -23, -17, -14,
          -12, -10, -3, -1, -4, -11, -22, -30, -34, -36, -36, -35, -35, -37,
          -38, -38, -37, -36, -35, -32, -28, -31, -35, -39, -44, -50, -51, -49,
          -44, -40, -38, -37, -36, -34, -32, -30, -29, -31, -34, -37, -38, -38,
          -36, -34, -34, -36, -37, -38, -37, -34, -35, -39, -34, -22, -9, -3,
          -3, -6, -19, -34, -39, -36, -34, -29, -18, -15, -12, -21, -28, -26,
          -23, -21, -22, -21, -22, -25, -29, -27, -29, -30, -31, -30, -29, -28,
          -29, -31, -30, -29, -28, -28, -27, -28, -28, -31, -32, -32, -33, -33,
          -32, -31, -34, -38, -38, -36, -33, -30, -26, -14, 1, 7, 7, 6, 4, -1,
          -6, -2, 5, 10, 13, 15, 11, 3, 0, 1, 4, 5, 6, 2, -10, -19, -21, -23,
          -25, -26, -27, -28, -27, -26, -25, -26, -27, -26, -25, -25, -26, -27,
          -27, -26, -26, -26, -27, -28, -29, -29, -29, -27, -26, -25, -25, -26,
          -27, -27, -26, -24, -24, -23, -22, -22, -24, -25, -30, -29, -26, -24,
          -26, -25, -19, -10, -9, -9, -9, -10, -9, -9, -9, -9, -9, -9, -10, -10,
          -10, -10, -10, -10, -11, -11, -10, -10, -10, -9, -9, -9, -9, -8, -8,
          -9, -11, -12, -16, -24, -38, -42, -45, -50, -42, -38, -40, -41, -40,
          -38, -36, -31, -16, -5, 0, 2, 3, -5, -4, -1, -1, -6, -18, -23, -25,
          -25, -26, -26, -26, -26, -24, -23, -22, -21, -20, -19, -15, -12, -17,
          -27, -33, -35, -35, -34, -33, -33, -35, -35, -34, -33, -33, -33, -34,
          -34, -33, -34, -34, -34, -33, -34, -37, -39, -40, -41, -39, -39, -39,
          -34, -25, -15, -8, -4, -1, -6, -14, -17, -13, -8, -3, -2, -4, -21,
          -27, -27, -25, -23, -24, -27, -29, -30, -30, -30, -32, -35, -41, -35,
          -25, -17, -10, -7, -5, -9, -18, -21, -22, -21, -20, -20, -21, -23,
          -24, -27, -28, -30, -32, -36, -38, -39, -38, -36, -33, -32, -28, -17,
          -11, -5, -4, -7, -17, -28, -28, -26, -20, -13, -10, -10, -13, -15,
          -16, -17, -16, -14, -12, -10, -8, -8, -7, -6, -3, -3, -1, -1, -2, -3,
          -5, -7, -7, -7, -7, -7, -8, -8, -8, -9, -10, -11, -18, -28, -22, -11,
          -12, -20, -29, -36, -37, -33, -30, -30, -27, -20, -3, 15, 29, 27, 11,
          -13, -29, -35, -29, -18, -17, -16, -21, -24, -21, -19, -19, -17, -18,
          -19, -19, -20, -21, -22, -24, -26, -25, -25, -27, -32, -32, -35, -41,
          -42, -38, -35, -34, -32, -31, -30, -28, -27, -26, -27, -29, -29, -29,
          -27, -25, -24,
        ],
        y: [
          0, -1, -1, -1, -1, 5, 29, 48, 51, 46, 39, 34, 30, 31, 38, 67, 141,
          198, 212, 200, 170, 126, 82, 52, 40, 40, 44, 46, 51, 60, 79, 118, 132,
          118, 71, 37, 33, 42, 91, 140, 150, 135, 96, 39, 16, 33, 89, 109, 111,
          106, 94, 80, 78, 101, 142, 164, 168, 134, 75, 54, 53, 54, 63, 88, 112,
          84, 70, 99, 160, 162, 100, 72, 65, 66, 84, 132, 159, 163, 154, 142,
          138, 155, 183, 174, 127, 75, 66, 70, 91, 131, 128, 105, 84, 77, 104,
          181, 203, 191, 181, 137, 90, 67, 61, 67, 68, 66, 63, 62, 60, 57, 46,
          42, 41, 39, 38, 38, 41, 70, 147, 173, 148, 107, 73, 52, 48, 49, 50,
          54, 54, 72, 136, 179, 182, 157, 117, 88, 69, 59, 54, 54, 55, 61, 69,
          82, 110, 120, 108, 84, 71, 75, 96, 127, 140, 140, 130, 96, 59, 58, 80,
          125, 136, 134, 126, 113, 106, 112, 134, 148, 120, 68, 64, 71, 96, 109,
          107, 99, 85, 80, 84, 93, 106, 104, 97, 97, 98, 108, 149, 148, 133,
          117, 109, 105, 110, 130, 144, 131, 131, 145, 163, 172, 171, 164, 145,
          100, 75, 74, 105, 179, 201, 186, 148, 107, 85, 74, 73, 77, 80, 80, 77,
          74, 70, 67, 62, 60, 60, 61, 60, 59, 63, 90, 130, 135, 126, 112, 99,
          88, 81, 80, 80, 81, 81, 82, 90, 146, 201, 215, 191, 142, 106, 82, 74,
          75, 76, 83, 91, 103, 117, 124, 119, 97, 93, 98, 114, 142, 169, 171,
          160, 117, 82, 81, 96, 132, 148, 151, 146, 137, 129, 124, 130, 149,
          163, 161, 136, 94, 75, 72, 73, 74, 72, 70, 69, 68, 66, 66, 66, 66, 65,
          73, 151, 228, 230, 187, 114, 92, 98, 138, 197, 196, 169, 130, 110,
          101, 106, 143, 186, 198, 195, 170, 134, 112, 120, 155, 158, 114, 94,
          89, 101, 140, 160, 157, 147, 135, 120, 108, 105, 106, 105, 104, 105,
          106, 126, 182, 183, 128, 104, 101, 107, 142, 219, 252, 257, 256, 244,
          202, 147, 115, 95, 96, 96, 95, 93, 91, 88, 78, 68, 62, 62, 63, 64, 64,
          63, 63, 63, 64, 64, 64, 64, 65, 65, 65, 66, 66, 66, 66, 67, 67, 67,
          67, 67, 66, 66, 66, 66, 66, 66, 66, 66, 65, 66, 66, 67, 67, 67, 66,
          66, 66, 65, 65, 65, 65, 65, 65, 65, 65, 64, 64, 64, 63, 63, 63, 63,
          63, 64, 65, 65, 66, 67, 67, 67, 68, 68, 68, 69, 69, 69, 69, 69, 69,
          69, 69, 69, 69, 69, 70, 69, 68, 68, 68, 68, 67, 66, 65, 67, 84, 162,
          178, 157, 117, 84, 69, 71, 87, 104, 115, 133, 150, 161, 174, 189, 194,
          191, 185, 179, 174, 172, 170, 167, 166, 162, 147, 127, 109, 102, 104,
          102, 98, 98, 97, 98, 108, 117, 116, 112, 108, 105, 109, 131, 164, 158,
          140, 123, 110, 109, 122, 122, 115, 117, 119, 120, 123, 138, 159, 148,
          123, 112, 107, 114, 134, 147, 142, 132, 128, 116, 83, 84, 137, 203,
          221, 220, 217, 214, 213, 210, 206, 196, 169, 136, 118, 107, 99, 99,
          99, 100, 103, 124, 149, 147, 142, 135, 128, 124, 128, 156, 166, 153,
          135, 119, 111, 114, 125, 129, 131, 132, 136, 140, 141, 150, 144, 123,
          117, 115, 116, 125, 144, 170, 136, 116, 114, 113, 120, 134, 151, 152,
          148, 145, 143, 145, 150, 151, 147, 140, 134, 129, 124, 117, 110, 106,
          105, 106, 108, 123, 148, 152, 150, 147, 143, 139, 141, 161, 189, 182,
          166, 144, 125, 116, 123, 145, 144, 134, 119, 100, 90, 94, 97, 96, 93,
          91, 95, 122, 183, 208, 196, 166, 134, 110, 88, 75, 71, 72, 72, 73, 73,
          72, 72, 72, 71, 71, 71, 71, 70, 69, 70, 71, 71, 71, 71, 72, 72, 72,
          72, 72, 72, 72, 72, 73, 74, 77, 89, 115, 172, 190, 199, 194, 156, 127,
          114, 114, 114, 114, 120, 163, 223, 195, 156, 147, 152, 182, 210, 194,
          170, 178, 185, 184, 183, 181, 177, 172, 169, 167, 166, 164, 161, 159,
          156, 155, 146, 124, 109, 108, 105, 102, 103, 105, 107, 125, 141, 139,
          135, 129, 127, 132, 157, 171, 161, 146, 130, 118, 117, 132, 136, 132,
          130, 134, 138, 142, 155, 172, 171, 151, 128, 107, 110, 138, 178, 187,
          170, 137, 109, 115, 146, 190, 190, 182, 168, 150, 133, 117, 104, 96,
          96, 97, 102, 111, 145, 199, 208, 186, 169, 159, 152, 155, 157, 148,
          137, 127, 124, 132, 159, 160, 150, 136, 122, 115, 118, 131, 134, 137,
          138, 134, 133, 134, 134, 127, 121, 117, 117, 123, 155, 222, 250, 244,
          210, 159, 110, 80, 75, 72, 68, 64, 60, 58, 57, 56, 56, 56, 57, 59, 60,
          61, 62, 66, 67, 70, 74, 76, 78, 79, 80, 80, 80, 79, 78, 76, 76, 85,
          117, 156, 151, 141, 142, 145, 156, 163, 160, 153, 150, 153, 157, 165,
          171, 164, 147, 133, 132, 159, 192, 210, 202, 164, 121, 80, 62, 56, 56,
          55, 54, 53, 52, 52, 52, 52, 53, 52, 51, 50, 51, 51, 52, 51, 52, 51,
          51, 51, 54, 56, 57, 60, 61, 61, 60, 59, 57, 54, 52, 49, 46, 44, 41,
          38,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -4, -6, -7, -10, -12, -14, -14, -13, -12, -12, -12,
          -11, -18, -19, -20, -19, -19, -21, -26, -28, -28, -27, -25, -22, -20,
          -17, -14, -9, -6, -1, 0, -6, -13, -14, -13, -11, -9, -8, -10, -6, -8,
          -9, -7, -8, -7, -7, -7, -5, -4, -5, -6, -5, -1, 4, -4, -13, -16, -14,
          -13, -19, -25, -20, -14, -16, -19, -18, -15, -17, -17, -15, -14, -17,
          -15, -12, -9, -7, -7, -10, -14, -16, -13, -8, -10, -12, -17, -17, -15,
          -10, -9, -8, -7, -8, -11, -9, -13, -10, -7, -10, -9, -9, -9, -9, -9,
          -9, -8, -6, 0, 5, 4, 2, 0, -1, -2, -3, -17, -10, -6, -8, -12, -6, -5,
          -5, -4, -4, -5, -5, -6, -5, -5, -3, -2, -5, -4, -3, -2, -1, -1, 2, 4,
          6, 8, 6, 2, -1, -3, -4, -1, 3, 6, 6, 4, 4, 4, 4, 2, 2, 5, 7, 7, 8, 9,
          9, 8, 6, -4, -14, -23, -24, -25, -26, -25, -20, -16, -17, -18, -20,
          -21, -19, -18, -17, -17, -15, -13, -10, -10, -10, -12, -15, -16, -13,
          -9, -7, -8, -11, -13, -12, -8, -6, -6, -6, -9, -14, -22, -29, -36,
          -35, -32, -30, -32, -34, -35, -37, -36, -34, -32, -29, -25, -23, -21,
          -20, -20, -21, -21, -22, -19, -16, -19, -22, -23, -25, -27, -27, -27,
          -27, -26, -25, -23, -23, -22, -22, -22, -20, -16, -11, -15, -16, -16,
          -16, -13, -12, -11, -11, -10, -14, -12, -12, -12, -13, -14, -14, -14,
          -12, -9, -5, -4, -3, -5, -11, -11, -10, -8, -9, -9, -8, -7, -5, -4,
          -2, -2, -9, -19, -21, -20, -19, -18, -18, -18, -18, -19, -20, -19,
          -19, -20, -21, -21, -31, -24, -21, -16, -3, -3, -6, -10, -11, -8, -6,
          -6, -9, -10, -11, -14, -14, -13, -11, -10, -10, -10, -11, -12, -11,
          -10, -10, -12, -16, -19, -22, -22, -23, -24, -24, -25, -28, -27, -26,
          -26, -26, -27, -29, -28, -26, -27, -26, -26, -32, -33, -28, -24, -22,
          -21, -27, -18, -21, -22, -22, -24, -25, -24, -24, -24, -20, -16, -13,
          -13, -13, -13, -13, -11, -9, -8, -7, -7, -8, -9, -9, -9, -9, -9, -8,
          -7, -6, -6, -7, -7, -8, -8, -8, -9, -9, -9, -9, -8, -7, -6, -6, -5,
          -4, -4, -4, -4, -4, -4, -5, -5, -5, -5, -5, -6, -7, -7, -8, -8, -8,
          -8, -8, -7, -6, -5, -6, -6, -6, -6, -6, -6, -6, -6, -6, -6, -7, -7,
          -7, -8, -8, -9, -9, -9, -9, -9, -8, -8, -8, -8, -10, -12, -12, -12,
          -12, -12, -11, -10, -5, 9, -12, -14, -9, -4, -2, 1, 6, 7, 4, -4, -14,
          -21, -24, -25, -25, -24, -24, -26, -27, -27, -25, -24, -23, -20, -16,
          -19, -23, -26, -32, -37, -38, -36, -30, -26, -24, -23, -22, -21, -19,
          -17, -16, -19, -26, -29, -28, -26, -24, -22, -23, -24, -26, -26, -26,
          -26, -27, -27, 1, 2, -21, -22, -23, -25, -29, -33, -32, -28, -25, -25,
          -26, -28, -26, -23, -20, -17, -14, -13, -13, -13, -14, -17, -20, -18,
          -18, -20, -20, -20, -18, -16, -16, -18, -18, -17, -17, -17, -16, -16,
          -18, -21, -23, -23, -23, -21, -20, -20, -22, -24, -24, -21, -19, -17,
          -15, -11, -8, -8, -10, -10, -10, -12, -13, -15, -14, -13, -11, -9,
          -11, -14, -16, -16, -15, -16, -15, -11, -9, -10, -12, -14, -15, -16,
          -18, -18, -17, -15, -14, -15, -16, -15, -15, -15, -17, -17, -17, -16,
          -16, -17, -19, -19, -20, -20, -19, -17, -15, -15, -15, -15, -15, -17,
          -16, -14, -14, -12, -12, -12, -13, -15, -20, -20, -17, -14, -17, -19,
          -15, -11, -13, -14, -14, -13, -12, -12, -12, -11, -11, -12, -13, -13,
          -13, -14, -13, -13, -14, -14, -13, -13, -13, -12, -12, -12, -12, -11,
          -11, -12, -15, -17, -24, -35, -47, -49, -50, -52, -40, -32, -33, -34,
          -33, -31, -28, -27, -23, -22, -22, -21, -18, -19, -15, -10, -5, -4,
          -10, -13, -14, -14, -15, -14, -14, -13, -12, -11, -10, -9, -9, -10,
          -8, -6, -10, -18, -23, -24, -24, -22, -21, -21, -23, -23, -23, -23,
          -23, -24, -25, -26, -24, -25, -24, -23, -23, -24, -26, -27, -27, -26,
          -25, -25, -24, -21, -14, -9, -9, -11, -12, -14, -17, -17, -18, -19,
          -19, -19, -16, -19, -17, -15, -13, -12, -13, -16, -18, -20, -19, -19,
          -20, -24, -28, -28, -24, -20, -15, -13, -12, -13, -16, -13, -9, -8,
          -7, -8, -10, -12, -14, -15, -16, -16, -18, -22, -23, -24, -23, -22,
          -22, -23, -23, -21, -21, -19, -19, -20, -20, -18, -15, -14, -12, -7,
          -5, -7, -7, -4, -3, -1, 0, 3, 5, 7, 9, 9, 9, 10, 12, 12, 13, 11, 9, 4,
          -1, -5, -6, -6, -7, -7, -7, -8, -8, -10, -12, -17, -27, -37, -30, -16,
          -15, -20, -24, -29, -30, -28, -26, -26, -22, -15, -1, 11, 19, 16, 3,
          -14, -21, -25, -19, -8, -7, -5, -8, -10, -6, -3, -3, -1, -1, -3, -3,
          -4, -6, -7, -9, -11, -11, -11, -14, -20, -21, -26, -34, -36, -31, -28,
          -26, -23, -23, -23, -21, -19, -20, -21, -23, -24, -24, -23, -22, -21,
        ],
        y: [
          0, -1, -1, -1, -1, 5, 34, 54, 57, 52, 45, 40, 38, 43, 56, 84, 171,
          234, 250, 234, 197, 147, 101, 72, 61, 63, 67, 70, 77, 86, 106, 144,
          159, 145, 100, 62, 57, 70, 118, 168, 175, 159, 117, 58, 32, 55, 112,
          130, 132, 125, 111, 97, 94, 121, 169, 191, 200, 168, 101, 68, 68, 69,
          78, 115, 136, 107, 90, 126, 193, 194, 126, 81, 75, 81, 106, 167, 192,
          191, 178, 164, 160, 180, 211, 199, 151, 89, 78, 81, 107, 152, 147,
          123, 98, 91, 130, 199, 236, 223, 212, 160, 107, 81, 74, 81, 81, 78,
          75, 73, 71, 67, 53, 47, 45, 43, 42, 42, 45, 78, 130, 194, 169, 122,
          82, 61, 56, 57, 60, 64, 64, 86, 155, 200, 204, 174, 130, 98, 79, 69,
          65, 65, 68, 76, 86, 99, 125, 138, 129, 100, 83, 89, 112, 143, 158,
          158, 145, 111, 73, 72, 99, 143, 153, 149, 140, 125, 119, 125, 148,
          162, 137, 78, 76, 90, 124, 138, 134, 126, 109, 103, 105, 111, 124,
          119, 112, 111, 111, 123, 168, 166, 151, 136, 130, 129, 136, 159, 173,
          159, 159, 171, 187, 195, 193, 185, 165, 120, 87, 86, 122, 191, 231,
          215, 171, 125, 102, 90, 88, 91, 94, 93, 89, 85, 80, 75, 69, 67, 67,
          67, 66, 66, 74, 111, 150, 154, 143, 127, 112, 101, 94, 92, 93, 94, 94,
          95, 104, 172, 227, 240, 215, 163, 125, 102, 96, 95, 96, 102, 110, 123,
          139, 149, 147, 124, 120, 125, 142, 167, 193, 195, 186, 145, 101, 101,
          117, 158, 168, 169, 164, 154, 145, 140, 146, 167, 182, 179, 155, 117,
          90, 87, 87, 87, 84, 81, 80, 78, 76, 76, 75, 75, 75, 90, 159, 187, 257,
          210, 141, 104, 112, 161, 227, 224, 193, 150, 129, 122, 128, 173, 218,
          227, 221, 193, 153, 126, 135, 177, 181, 132, 105, 99, 117, 171, 185,
          178, 167, 153, 137, 123, 120, 120, 120, 119, 120, 120, 141, 205, 212,
          152, 117, 112, 121, 175, 256, 292, 297, 297, 282, 229, 170, 135, 115,
          116, 116, 114, 110, 108, 105, 93, 81, 73, 72, 73, 74, 74, 72, 71, 71,
          72, 73, 73, 73, 73, 73, 73, 73, 74, 74, 74, 75, 75, 75, 75, 75, 74,
          74, 74, 74, 74, 74, 74, 74, 74, 74, 74, 75, 75, 75, 74, 74, 74, 73,
          73, 72, 72, 72, 73, 73, 73, 72, 72, 71, 71, 71, 70, 71, 71, 72, 73,
          73, 74, 75, 75, 76, 76, 76, 77, 77, 77, 78, 78, 78, 77, 78, 77, 77,
          78, 79, 80, 82, 83, 83, 82, 81, 80, 78, 77, 82, 105, 132, 214, 188,
          144, 108, 94, 100, 124, 142, 154, 171, 183, 194, 206, 223, 229, 226,
          219, 212, 207, 204, 202, 199, 198, 195, 178, 156, 136, 128, 131, 128,
          123, 123, 123, 124, 136, 146, 144, 140, 135, 131, 136, 161, 202, 194,
          172, 150, 137, 135, 151, 151, 145, 146, 149, 151, 155, 167, 167, 167,
          167, 153, 143, 150, 171, 177, 168, 159, 155, 145, 109, 106, 167, 236,
          258, 257, 253, 251, 249, 247, 242, 231, 201, 165, 145, 133, 125, 124,
          123, 124, 129, 154, 184, 184, 178, 169, 160, 154, 158, 188, 198, 183,
          164, 147, 139, 143, 155, 158, 159, 160, 164, 168, 174, 194, 194, 171,
          162, 158, 158, 167, 187, 218, 175, 146, 139, 138, 149, 169, 189, 192,
          187, 183, 180, 180, 180, 178, 174, 167, 160, 155, 149, 141, 133, 129,
          128, 129, 132, 149, 178, 182, 180, 176, 171, 167, 169, 192, 221, 213,
          196, 172, 151, 141, 148, 173, 171, 161, 148, 132, 122, 128, 130, 129,
          125, 123, 127, 158, 219, 243, 229, 195, 159, 132, 109, 96, 92, 93, 94,
          95, 94, 93, 93, 92, 92, 91, 91, 92, 91, 90, 90, 90, 90, 90, 90, 91,
          91, 90, 91, 91, 91, 91, 91, 92, 94, 98, 113, 150, 210, 228, 236, 228,
          186, 154, 140, 141, 140, 141, 149, 194, 266, 233, 193, 185, 190, 222,
          252, 230, 203, 211, 215, 213, 212, 210, 206, 202, 198, 196, 194, 193,
          190, 187, 186, 186, 175, 149, 131, 128, 124, 121, 121, 124, 128, 150,
          169, 168, 162, 155, 152, 159, 188, 202, 190, 173, 155, 142, 141, 159,
          164, 159, 155, 158, 163, 168, 181, 203, 208, 191, 167, 143, 147, 179,
          220, 227, 211, 174, 140, 145, 177, 220, 218, 209, 193, 174, 156, 139,
          124, 115, 114, 116, 121, 130, 163, 226, 239, 218, 201, 188, 181, 185,
          184, 167, 152, 143, 141, 149, 179, 180, 169, 153, 138, 130, 133, 148,
          153, 156, 159, 157, 158, 161, 164, 159, 149, 143, 143, 150, 182, 246,
          276, 268, 230, 172, 118, 85, 79, 76, 71, 65, 60, 59, 57, 57, 58, 58,
          59, 60, 62, 62, 64, 69, 71, 75, 81, 84, 86, 87, 87, 88, 88, 87, 86,
          85, 88, 99, 135, 186, 178, 165, 165, 168, 178, 185, 182, 176, 176,
          179, 185, 193, 202, 197, 180, 160, 157, 185, 216, 233, 223, 183, 132,
          86, 63, 58, 57, 56, 55, 54, 53, 53, 53, 54, 54, 54, 53, 52, 52, 53,
          54, 54, 55, 55, 55, 57, 60, 62, 64, 66, 67, 68, 68, 66, 64, 60, 58,
          55, 52, 49, 46, 42,
        ],
      },
      {
        x: [
          0, -1, -1, -2, -3, -7, -11, -15, -14, -15, -13, -11, -9, -9, -9, -10,
          -16, -19, -20, -21, -20, -19, -22, -22, -21, -19, -16, -12, -8, -3, 5,
          13, 17, 19, 10, -2, -11, -9, 1, 5, 7, 9, 6, 7, 2, 3, 10, 12, 14, 14,
          15, 16, 17, 17, 16, 16, 19, 19, 3, -13, -16, -13, -10, -14, -18, -12,
          -5, -5, -10, -17, -20, -23, -26, -25, -22, -16, -4, 4, 9, 11, 10, 6,
          0, -6, -15, -17, -20, -21, -19, -14, -10, -3, 1, 3, 3, -6, -3, -1, -3,
          2, 4, 2, 3, 5, 5, 5, 4, 5, 5, 2, 0, 2, 3, 2, 1, 1, 1, 1, 0, 9, 14, 10,
          7, 10, 12, 12, 14, 15, 15, 15, 13, 14, 14, 15, 16, 15, 17, 19, 20, 22,
          23, 27, 30, 33, 36, 35, 29, 17, 10, 10, 17, 22, 25, 26, 25, 20, 12,
          10, 11, 18, 23, 25, 25, 26, 27, 27, 26, 24, 9, -5, -15, -17, -17, -18,
          -18, -18, -17, -19, -15, -7, -2, 3, 6, 6, 6, 7, 8, 11, 11, 10, 6, -1,
          -8, -12, -15, -16, -19, -18, -10, -2, 5, 9, 6, -7, -15, -20, -25, -32,
          -34, -32, -30, -29, -31, -30, -29, -29, -26, -23, -20, -17, -14, -12,
          -13, -13, -12, -12, -12, -13, -7, 1, 3, 2, 2, 0, -2, -2, -2, -2, 0, 1,
          2, 2, 4, 3, 2, 3, 6, 11, 8, 8, 8, 8, 12, 14, 15, 17, 19, 14, 6, -4,
          -12, -15, -9, 4, 8, 10, 9, 3, -7, -11, -13, -4, 7, 11, 12, 12, 12, 13,
          14, 14, 15, 16, 13, 0, -14, -16, -14, -13, -10, -9, -9, -9, -10, -10,
          -10, -10, -10, -12, -14, -20, -13, -8, -2, 7, 7, 4, 0, 0, 1, -4, -9,
          -14, -17, -16, -10, -1, 4, 5, 4, 1, 0, -1, -8, -15, -16, -16, -15, -9,
          -6, -5, -5, -7, -7, -7, -9, -10, -9, -11, -10, -10, -12, -17, -22,
          -29, -31, -29, -27, -29, -29, -23, -20, -18, -15, -17, -6, -6, -6, -6,
          -8, -9, -9, -9, -11, -12, -12, -12, -12, -12, -11, -11, -8, -6, -5,
          -4, -4, -4, -4, -4, -4, -4, -3, -1, 0, 0, 0, 0, 0, -1, -1, -1, -2, -2,
          -2, -2, -1, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0, 0, 0,
          0, 0, -1, -1, 0, 1, 2, 1, 2, 1, 1, 1, 0, 1, 0, 0, 0, 0, -1, -1, -1,
          -2, -2, -3, -3, -3, -3, -2, -2, -2, -3, -5, -7, -7, -7, -6, -6, -6,
          -3, 9, 9, 9, 9, 14, 18, 22, 26, 28, 29, 27, 20, 9, 3, 2, 2, 2, 3, 3,
          0, -1, -1, 0, 1, 3, 6, 10, 8, 5, 2, -4, -9, -10, -8, -3, 2, 3, 4, 4,
          6, 8, 9, 10, 8, 2, 0, 1, 4, 6, 7, 7, 5, 5, 5, 6, 6, 4, 3, 0, -7, -15,
          -22, -28, -30, -27, -17, -10, -3, 1, -3, -15, -23, -20, -6, 1, 4, 6,
          7, 7, 7, 6, 4, 1, 4, 5, 4, 4, 5, 7, 9, 10, 10, 11, 13, 11, 9, 9, 8, 6,
          3, 1, 2, 2, 4, 6, 7, 5, 4, 6, 10, 14, 16, 17, 17, 9, 0, -7, -8, -7,
          -5, -3, -8, -18, -21, -20, -19, -18, -16, -12, -12, -15, -18, -18, -8,
          9, 16, 14, 13, 11, 10, 9, 9, 11, 12, 13, 13, 12, 13, 13, 13, 11, 11,
          11, 11, 11, 10, 8, 7, 7, 8, 9, 11, 13, 12, 12, 14, 16, 16, 17, 18, 18,
          19, 20, 20, 19, 16, 9, 9, 11, 14, 12, 10, 12, 11, 4, 1, 1, 2, 4, 4, 4,
          5, 5, 4, 4, 4, 3, 2, 3, 3, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 3, 0, -4,
          -12, -20, -30, -32, -32, -31, -16, -4, -4, -5, -3, -1, 1, 0, -13, -20,
          -26, -29, -24, -17, -8, 0, 8, 15, 10, 9, 9, 11, 11, 12, 13, 14, 15,
          16, 16, 18, 17, 17, 15, 15, 12, 6, 3, 3, 3, 5, 6, 7, 4, 5, 4, 4, 4, 3,
          1, 0, 2, 3, 4, 5, 6, 5, 4, 4, 5, 5, 6, 7, 8, 10, 17, 18, 8, -1, -4,
          -4, -1, 0, -5, -14, -21, -24, -17, -4, 4, 6, 8, 9, 9, 8, 6, 5, 6, 6,
          6, 4, -1, -8, -11, -8, -5, -4, -4, -3, 0, 7, 11, 13, 13, 13, 11, 9, 9,
          9, 9, 8, 6, 3, 4, 5, 7, 7, 5, 3, 1, -7, -15, -20, -21, -20, -8, 1, 4,
          5, 4, 7, 8, 7, 9, 14, 18, 21, 26, 29, 31, 33, 34, 34, 34, 33, 34, 33,
          32, 29, 26, 21, 14, 8, 5, 5, 5, 4, 4, 4, 4, 2, -1, -8, -19, -29, -22,
          -9, -4, -3, -1, -4, -5, -5, -5, -5, 0, 8, 17, 24, 23, 16, 4, 0, 0, -3,
          2, 11, 12, 15, 15, 16, 19, 23, 23, 24, 23, 22, 22, 21, 19, 19, 17, 17,
          17, 16, 14, 10, 9, 4, -4, -7, -6, -3, -2, -1, -2, -2, -1, 0, -1, -3,
          -5, -7, -7, -9, -4, -5, 0, -1, -1, -2, -3, -7, -11, -15, -14, -15,
          -13, -11, -9, -9, -9, -10, -16, -19, -20, -21, -20, -19, -22, -22,
          -21, -19, -16, -12, -8, -3, 5, 13, 17, 19, 10, -2, -11, -9, 1, 5, 7,
          9, 6, 7, 2, 3, 10, 12, 14, 14, 15, 16, 17, 17, 16, 16, 19, 19, 3, -13,
          -16, -13, -10, -14, -18, -12, -5, -5, -10, -17, -20, -23, -26, -25,
          -22, -16, -4, 4, 9, 11, 10, 6, 0, -6, -15, -17, -20, -21, -19, -14,
          -10, -3, 1, 3, 3, -6, -3, -1, -3, 2, 4, 2, 3, 5, 5, 5, 4, 5, 5, 2, 0,
          2, 3, 2, 1, 1, 1, 1, 0, 9, 14, 10, 7, 10, 12, 12, 14, 15, 15, 15, 13,
          14, 14, 15, 16, 15, 17, 19, 20, 22, 23, 27, 30, 33, 36, 35, 29, 17,
          10, 10, 17, 22, 25, 26, 25, 20, 12, 10, 11, 18, 23, 25, 25, 26, 27,
          27, 26, 24, 9, -5, -15, -17, -17, -18, -18, -18, -17, -19, -15, -7,
          -2, 3, 6, 6, 6, 7, 8, 11, 11, 10, 6, -1, -8, -12, -15, -16, -19, -18,
          -10, -2, 5, 9, 6, -7, -15, -20, -25, -32, -34, -32, -30, -29, -31,
          -30, -29, -29, -26, -23, -20, -17, -14, -12, -13, -13, -12, -12, -12,
          -13, -7, 1, 3, 2, 2, 0, -2, -2, -2, -2, 0, 1, 2, 2, 4, 3, 2, 3, 6, 11,
          8, 8, 8, 8, 12, 14, 15, 17, 19, 14, 6, -4, -12, -15, -9, 4, 8, 10, 9,
          3, -7, -11, -13, -4, 7, 11, 12, 12, 12, 13, 14, 14, 15, 16, 13, 0,
          -14, -16, -14, -13, -10, -9, -9, -9, -10, -10, -10, -10, -10, -12,
          -14, -20, -13, -8, -2, 7, 7, 4, 0, 0, 1, -4, -9, -14, -17, -16, -10,
          -1, 4, 5, 4, 1, 0, -1, -8, -15, -16, -16, -15, -9, -6, -5, -5, -7, -7,
          -7, -9, -10, -9, -11, -10, -10, -12, -17, -22, -29, -31, -29, -27,
          -29, -29, -23, -20, -18, -15, -17, -6, -6, -6, -6, -8, -9, -9, -9,
          -11, -12, -12, -12, -12, -12, -11, -11, -8, -6, -5, -4, -4, -4, -4,
          -4, -4, -4, -3, -1, 0, 0, 0, 0, 0, -1, -1, -1, -2, -2, -2, -2, -1, 0,
          1, 1, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, -1, -1, 0,
          1, 2, 1, 2, 1, 1, 1, 0, 1, 0, 0, 0, 0, -1, -1, -1, -2, -2, -3, -3, -3,
          -3, -2, -2, -2, -3, -5, -7, -7, -7, -6, -6, -6, -3, 9, 9, 9, 9, 14,
          18, 22, 26, 28, 29, 27, 20, 9, 3, 2, 2, 2, 3, 3, 0, -1, -1, 0, 1, 3,
          6, 10, 8, 5, 2, -4, -9, -10, -8, -3, 2, 3, 4, 4, 6, 8, 9, 10, 8, 2, 0,
          1, 4, 6, 7, 7, 5, 5, 5, 6, 6, 4, 3, 0, -7, -15, -22, -28, -30, -27,
          -17, -10, -3, 1, -3, -15, -23, -20, -6, 1, 4, 6, 7, 7, 7, 6, 4, 1, 4,
          5, 4, 4, 5, 7, 9, 10, 10, 11, 13, 11, 9, 9, 8, 6, 3, 1, 2, 2, 4, 6, 7,
          5, 4, 6, 10, 14, 16, 17, 17, 9, 0, -7, -8, -7, -5, -3, -8, -18, -21,
          -20, -19, -18, -16, -12, -12, -15, -18, -18, -8, 9, 16, 14, 13, 11,
          10, 9, 9, 11, 12, 13, 13, 12, 13, 13, 13, 11, 11, 11, 11, 11, 10, 8,
          7, 7, 8, 9, 11, 13, 12, 12, 14, 16, 16, 17, 18, 18, 19, 20, 20, 19,
          16, 9, 9, 11, 14, 12, 10, 12, 11, 4, 1, 1, 2, 4, 4, 4, 5, 5, 4, 4, 4,
          3, 2, 3, 3, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 3, 0, -4, -12, -20, -30,
          -32, -32, -31, -16, -4, -4, -5, -3, -1, 1, 0, -13, -20, -26, -29, -24,
          -17, -8, 0, 8, 15, 10, 9, 9, 11, 11, 12, 13, 14, 15, 16, 16, 18, 17,
          17, 15, 15, 12, 6, 3, 3, 3, 5, 6, 7, 4, 5, 4, 4, 4, 3, 1, 0, 2, 3, 4,
          5, 6, 5, 4, 4, 5, 5, 6, 7, 8, 10, 17, 18, 8, -1, -4, -4, -1, 0, -5,
          -14, -21, -24, -17, -4, 4, 6, 8, 9, 9, 8, 6, 5, 6, 6, 6, 4, -1, -8,
          -11, -8, -5, -4, -4, -3, 0, 7, 11, 13, 13, 13, 11, 9, 9, 9, 9, 8, 6,
          3, 4, 5, 7, 7, 5, 3, 1, -7, -15, -20, -21, -20, -8, 1, 4, 5, 4, 7, 8,
          7, 9, 14, 18, 21, 26, 29, 31, 33, 34, 34, 34, 33, 34, 33, 32, 29, 26,
          21, 14, 8, 5, 5, 5, 4, 4, 4, 4, 2, -1, -8, -19, -29, -22, -9, -4, -3,
          -1, -4, -5, -5, -5, -5, 0, 8, 17, 24, 23, 16, 4, 0, 0, -3, 2, 11, 12,
          15, 15, 16, 19, 23, 23, 24, 23, 22, 22, 21, 19, 19, 17, 17, 17, 16,
          14, 10, 9, 4, -4, -7, -6, -3, -2, -1, -2, -2, -1, 0, -1, -3, -5, -7,
          -7, -9, -4, -5, -977,
        ],
        y: [
          0, -1, -1, -1, -1, 4, 31, 50, 53, 48, 40, 36, 33, 38, 46, 72, 140,
          192, 205, 190, 157, 112, 68, 41, 29, 31, 35, 38, 45, 56, 71, 108, 124,
          107, 58, 21, 18, 30, 75, 121, 130, 115, 75, 23, -2, 17, 72, 94, 96,
          91, 79, 65, 61, 83, 122, 142, 151, 126, 75, 48, 51, 52, 59, 84, 101,
          74, 58, 86, 145, 151, 95, 67, 62, 63, 81, 127, 151, 150, 141, 130,
          124, 139, 167, 155, 108, 67, 61, 63, 79, 117, 111, 91, 71, 65, 91,
          160, 192, 181, 170, 126, 80, 56, 50, 56, 56, 54, 52, 51, 50, 47, 36,
          32, 32, 32, 32, 33, 36, 63, 132, 153, 127, 85, 56, 40, 35, 34, 35, 38,
          38, 55, 113, 155, 158, 133, 95, 66, 46, 35, 31, 31, 34, 42, 50, 62,
          85, 98, 90, 57, 40, 49, 74, 104, 119, 118, 103, 67, 35, 35, 61, 104,
          115, 113, 105, 93, 88, 92, 111, 124, 102, 58, 58, 68, 88, 98, 96, 91,
          79, 73, 75, 83, 97, 95, 89, 88, 88, 98, 139, 139, 124, 109, 98, 94,
          98, 119, 135, 124, 124, 133, 147, 153, 156, 151, 134, 93, 68, 68, 94,
          162, 187, 176, 139, 98, 75, 64, 61, 64, 66, 66, 64, 62, 60, 57, 53,
          52, 52, 53, 53, 52, 54, 78, 115, 120, 110, 96, 83, 72, 67, 65, 66, 66,
          66, 67, 75, 126, 177, 189, 165, 115, 80, 60, 53, 51, 53, 59, 66, 80,
          96, 108, 102, 80, 78, 85, 102, 129, 153, 155, 143, 103, 64, 63, 78,
          114, 128, 130, 126, 118, 109, 104, 109, 126, 141, 138, 117, 88, 69,
          69, 71, 73, 72, 70, 69, 68, 66, 66, 65, 64, 65, 72, 140, 209, 216,
          170, 102, 75, 79, 118, 179, 178, 153, 117, 98, 91, 97, 137, 180, 188,
          183, 156, 118, 95, 103, 140, 145, 106, 89, 83, 92, 134, 150, 146, 135,
          122, 107, 95, 89, 88, 89, 85, 85, 86, 104, 162, 170, 122, 105, 104,
          111, 141, 210, 240, 244, 245, 233, 188, 138, 107, 88, 89, 88, 86, 84,
          82, 79, 71, 63, 59, 60, 61, 62, 62, 61, 60, 60, 61, 61, 61, 62, 62,
          62, 61, 62, 63, 63, 63, 63, 64, 64, 64, 64, 64, 63, 64, 64, 64, 63,
          63, 63, 63, 63, 64, 64, 64, 64, 63, 63, 63, 63, 62, 62, 62, 62, 62,
          62, 62, 62, 61, 61, 61, 60, 60, 61, 61, 62, 62, 63, 63, 64, 65, 65,
          65, 65, 65, 66, 67, 67, 67, 67, 66, 66, 66, 67, 67, 68, 69, 71, 72,
          72, 72, 71, 70, 69, 67, 70, 87, 155, 170, 149, 109, 76, 58, 60, 81,
          98, 109, 126, 139, 150, 162, 176, 181, 177, 172, 165, 161, 159, 157,
          155, 155, 154, 141, 121, 103, 95, 98, 96, 92, 92, 92, 92, 102, 109,
          109, 105, 101, 97, 102, 127, 165, 160, 141, 120, 106, 105, 118, 117,
          111, 111, 112, 114, 116, 126, 151, 143, 123, 110, 102, 107, 124, 130,
          124, 119, 117, 108, 77, 72, 127, 193, 207, 204, 200, 198, 197, 195,
          191, 183, 158, 128, 110, 99, 92, 91, 91, 90, 92, 113, 139, 141, 135,
          128, 121, 116, 121, 149, 158, 146, 128, 112, 103, 106, 115, 118, 119,
          120, 124, 128, 134, 155, 154, 127, 115, 110, 109, 118, 138, 165, 132,
          111, 111, 109, 114, 127, 144, 149, 146, 143, 140, 140, 141, 141, 137,
          132, 126, 121, 116, 110, 102, 100, 98, 98, 100, 115, 141, 145, 143,
          139, 135, 132, 133, 154, 181, 176, 160, 139, 120, 111, 117, 139, 138,
          127, 112, 94, 82, 84, 85, 83, 80, 80, 83, 110, 172, 196, 185, 152,
          115, 90, 71, 61, 62, 64, 66, 68, 68, 68, 68, 68, 68, 68, 69, 70, 70,
          69, 69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 70, 70, 70, 71, 72, 77,
          91, 116, 173, 188, 193, 186, 149, 120, 106, 105, 105, 106, 112, 153,
          215, 192, 154, 144, 147, 176, 203, 185, 159, 164, 171, 171, 173, 171,
          168, 165, 162, 159, 157, 156, 154, 153, 153, 155, 141, 119, 102, 97,
          94, 92, 93, 96, 98, 114, 131, 128, 124, 118, 117, 123, 149, 165, 156,
          142, 126, 114, 114, 129, 134, 130, 124, 126, 130, 135, 149, 172, 180,
          164, 135, 111, 114, 142, 182, 190, 174, 138, 106, 109, 137, 175, 176,
          168, 155, 139, 124, 110, 98, 90, 89, 91, 95, 105, 132, 187, 198, 181,
          167, 154, 147, 148, 148, 133, 120, 114, 112, 121, 148, 151, 142, 128,
          114, 106, 107, 120, 124, 128, 132, 131, 134, 138, 140, 131, 120, 114,
          112, 119, 149, 203, 230, 223, 187, 139, 98, 73, 67, 63, 59, 53, 49,
          47, 45, 45, 45, 45, 47, 48, 49, 49, 52, 56, 58, 64, 72, 78, 81, 84,
          85, 86, 86, 86, 86, 86, 88, 96, 130, 165, 157, 143, 140, 145, 155,
          162, 158, 151, 148, 150, 156, 163, 169, 166, 155, 133, 129, 155, 185,
          199, 189, 152, 108, 71, 52, 49, 47, 45, 44, 43, 42, 43, 43, 44, 44,
          44, 44, 44, 44, 45, 46, 48, 49, 51, 54, 56, 57, 58, 59, 59, 59, 58,
          58, 56, 54, 51, 48, 45, 42, 38, 41, 37, 0, -1, -1, -1, -1, 4, 31, 50,
          53, 48, 40, 36, 33, 38, 46, 72, 140, 192, 205, 190, 157, 112, 68, 41,
          29, 31, 35, 38, 45, 56, 71, 108, 124, 107, 58, 21, 18, 30, 75, 121,
          130, 115, 75, 23, -2, 17, 72, 94, 96, 91, 79, 65, 61, 83, 122, 142,
          151, 126, 75, 48, 51, 52, 59, 84, 101, 74, 58, 86, 145, 151, 95, 67,
          62, 63, 81, 127, 151, 150, 141, 130, 124, 139, 167, 155, 108, 67, 61,
          63, 79, 117, 111, 91, 71, 65, 91, 160, 192, 181, 170, 126, 80, 56, 50,
          56, 56, 54, 52, 51, 50, 47, 36, 32, 32, 32, 32, 33, 36, 63, 132, 153,
          127, 85, 56, 40, 35, 34, 35, 38, 38, 55, 113, 155, 158, 133, 95, 66,
          46, 35, 31, 31, 34, 42, 50, 62, 85, 98, 90, 57, 40, 49, 74, 104, 119,
          118, 103, 67, 35, 35, 61, 104, 115, 113, 105, 93, 88, 92, 111, 124,
          102, 58, 58, 68, 88, 98, 96, 91, 79, 73, 75, 83, 97, 95, 89, 88, 88,
          98, 139, 139, 124, 109, 98, 94, 98, 119, 135, 124, 124, 133, 147, 153,
          156, 151, 134, 93, 68, 68, 94, 162, 187, 176, 139, 98, 75, 64, 61, 64,
          66, 66, 64, 62, 60, 57, 53, 52, 52, 53, 53, 52, 54, 78, 115, 120, 110,
          96, 83, 72, 67, 65, 66, 66, 66, 67, 75, 126, 177, 189, 165, 115, 80,
          60, 53, 51, 53, 59, 66, 80, 96, 108, 102, 80, 78, 85, 102, 129, 153,
          155, 143, 103, 64, 63, 78, 114, 128, 130, 126, 118, 109, 104, 109,
          126, 141, 138, 117, 88, 69, 69, 71, 73, 72, 70, 69, 68, 66, 66, 65,
          64, 65, 72, 140, 209, 216, 170, 102, 75, 79, 118, 179, 178, 153, 117,
          98, 91, 97, 137, 180, 188, 183, 156, 118, 95, 103, 140, 145, 106, 89,
          83, 92, 134, 150, 146, 135, 122, 107, 95, 89, 88, 89, 85, 85, 86, 104,
          162, 170, 122, 105, 104, 111, 141, 210, 240, 244, 245, 233, 188, 138,
          107, 88, 89, 88, 86, 84, 82, 79, 71, 63, 59, 60, 61, 62, 62, 61, 60,
          60, 61, 61, 61, 62, 62, 62, 61, 62, 63, 63, 63, 63, 64, 64, 64, 64,
          64, 63, 64, 64, 64, 63, 63, 63, 63, 63, 64, 64, 64, 64, 63, 63, 63,
          63, 62, 62, 62, 62, 62, 62, 62, 62, 61, 61, 61, 60, 60, 61, 61, 62,
          62, 63, 63, 64, 65, 65, 65, 65, 65, 66, 67, 67, 67, 67, 66, 66, 66,
          67, 67, 68, 69, 71, 72, 72, 72, 71, 70, 69, 67, 70, 87, 155, 170, 149,
          109, 76, 58, 60, 81, 98, 109, 126, 139, 150, 162, 176, 181, 177, 172,
          165, 161, 159, 157, 155, 155, 154, 141, 121, 103, 95, 98, 96, 92, 92,
          92, 92, 102, 109, 109, 105, 101, 97, 102, 127, 165, 160, 141, 120,
          106, 105, 118, 117, 111, 111, 112, 114, 116, 126, 151, 143, 123, 110,
          102, 107, 124, 130, 124, 119, 117, 108, 77, 72, 127, 193, 207, 204,
          200, 198, 197, 195, 191, 183, 158, 128, 110, 99, 92, 91, 91, 90, 92,
          113, 139, 141, 135, 128, 121, 116, 121, 149, 158, 146, 128, 112, 103,
          106, 115, 118, 119, 120, 124, 128, 134, 155, 154, 127, 115, 110, 109,
          118, 138, 165, 132, 111, 111, 109, 114, 127, 144, 149, 146, 143, 140,
          140, 141, 141, 137, 132, 126, 121, 116, 110, 102, 100, 98, 98, 100,
          115, 141, 145, 143, 139, 135, 132, 133, 154, 181, 176, 160, 139, 120,
          111, 117, 139, 138, 127, 112, 94, 82, 84, 85, 83, 80, 80, 83, 110,
          172, 196, 185, 152, 115, 90, 71, 61, 62, 64, 66, 68, 68, 68, 68, 68,
          68, 68, 69, 70, 70, 69, 69, 69, 69, 69, 70, 70, 70, 70, 70, 70, 70,
          70, 70, 71, 72, 77, 91, 116, 173, 188, 193, 186, 149, 120, 106, 105,
          105, 106, 112, 153, 215, 192, 154, 144, 147, 176, 203, 185, 159, 164,
          171, 171, 173, 171, 168, 165, 162, 159, 157, 156, 154, 153, 153, 155,
          141, 119, 102, 97, 94, 92, 93, 96, 98, 114, 131, 128, 124, 118, 117,
          123, 149, 165, 156, 142, 126, 114, 114, 129, 134, 130, 124, 126, 130,
          135, 149, 172, 180, 164, 135, 111, 114, 142, 182, 190, 174, 138, 106,
          109, 137, 175, 176, 168, 155, 139, 124, 110, 98, 90, 89, 91, 95, 105,
          132, 187, 198, 181, 167, 154, 147, 148, 148, 133, 120, 114, 112, 121,
          148, 151, 142, 128, 114, 106, 107, 120, 124, 128, 132, 131, 134, 138,
          140, 131, 120, 114, 112, 119, 149, 203, 230, 223, 187, 139, 98, 73,
          67, 63, 59, 53, 49, 47, 45, 45, 45, 45, 47, 48, 49, 49, 52, 56, 58,
          64, 72, 78, 81, 84, 85, 86, 86, 86, 86, 86, 88, 96, 130, 165, 157,
          143, 140, 145, 155, 162, 158, 151, 148, 150, 156, 163, 169, 166, 155,
          133, 129, 155, 185, 199, 189, 152, 108, 71, 52, 49, 47, 45, 44, 43,
          42, 43, 43, 44, 44, 44, 44, 44, 44, 45, 46, 48, 49, 51, 54, 56, 57,
          58, 59, 59, 59, 58, 58, 56, 54, 51, 48, 45, 42, 38, 41, 37, -497,
        ],
      },
    ],
    labels = [];
  (labels.en = {
    add_to_playlist: "Add to playlist",
    center_of_mouth: "Center of the mouth",
    click_here: "click here",
    copied: "Copied!",
    copy_link: "Copy link",
    copy_failed: "Could not copy. Sorry!",
    edit: "«  返回",
    make_instruction: "", //"<p>让你的照片动起来动起来</p><ul><li>本页面使用国外接口搭建</li><li>上传一张人物正面头像照片</li><li>娱乐功能</li></ul>",
    go: "GO!",
    head_width: "Head width",
    hi: "Hi there!",
    in_android:
      "In Android you can also share the page by selecting 'Share ...' in the browser menu at the top right.",
    in_ios_1: "In iOS you can also share by clicking",
    in_ios_2: "in the toolbar.",
    jawline: "Jawline",
    left_of_mouth: "Left corner of the mouth",
    left_eyelid: "Left eyelid",
    make_another: "Make another",
    make_your_own: "Make your own!",
    mark: "Mark the eyelids and the mouth",
    move_photo: "移动照片与下颌线和头宽引导线对齐",
    music_maker: "Music maker and programmer",
    name_of_person: "Name of person (optional)",
    next: "下一步  »",
    peace_out: "Peace out y'all!",
    press_to_copy:
      "Press the button below to copy the link. Paste it into any app or text message.",
    right_of_mouth: "Right corner of the mouth",
    right_eyelid: "Right eyelid",
    save_and_share: "保存", //"暂不提供保存和分享  »",
    saving: "Saving ...",
    scale_and_rotate: "移动和旋转",
    share: "Share this nodder",
    share_on_facebook: "Share on Facebook",
    switch_image: "«  重新上传",
    take_photo: "赶快上传试试",
    report:
      "The image used in this animation was uploaded by a visitor. It can only be viewed by those who have this specific link. If you for some reason would like to remove it, please",
    the_song:
      "This song is dedicated to you who prefer a stationary method of dancing. I also made this little web app to demonstrate how to do it. Hope you'll enjoy it.",
    transform_image: "«  更改图像",
    unable_webgl:
      "Unable to initialize WebGL. Your browser may not support it.",
    user_generated: "User generated content",
  }),
    (labels.es = {
      add_to_playlist: "Ir a la canción",
      center_of_mouth: "Centro de la boca",
      click_here: "haga clic aquí",
      copied: "¡Copiado!",
      copy_link: "Copiar enlace",
      copy_failed: "No se ha podido copiar. ¡Perdón!",
      edit: "«  返回",
      make_instruction: "", //"<p>Para un mejor resultado, toma la foto con:</p><ul><li>el rostro de frente</li><li>espacio alrededor de toda la cabeza</li><li>un fondo neutro</li><li>la boca cerrada</li></ul>",
      go: "¡VAMOS!",
      head_width: "Ancho de la cabeza",
      hi: "¡Hola!",
      in_android:
        "En sistemas Android puedes también compartir la página seleccionando 'Compartir...' en el menú del navegador, en la parte superior derecha.",
      in_ios_1: "En sistemas iOS puedes también compartir haciendo click",
      in_ios_2: "en la barra de herramientas.",
      jawline: "Mandíbula",
      left_of_mouth: "Esquina izquierda de la boca",
      left_eyelid: "Párpado izquierdo",
      make_another: "Hacer otra",
      make_your_own: "Haz el tuyo!",
      mark: "Marcar los párpados y la boca",
      move_photo:
        "Mover la foto para alinearla con las guías de la mandíbula y la cabeza",
      music_maker: "Music maker y programador",
      name_of_person: "Nombre de la persona (opcional)",
      next: "Próximo  »",
      peace_out: "Peace out y'all!",
      press_to_copy:
        "Presiona el botón que aparece a continuación para copiar el enlace. Pégalo en cualquier app o mensaje de texto.",
      right_of_mouth: "Esquina derecha de la boca",
      right_eyelid: "Párpado derecho",
      save_and_share: "Guardar y Compartir  »",
      saving: "Guardando ...",
      scale_and_rotate: "Escalar y Girar",
      share: 'Compartir este "nod"',
      share_on_facebook: "Compartir en Facebook",
      switch_image: "«  Cambiar la imagen",
      take_photo: "Tomar / Seleccionar foto",
      report:
        "La imagen usada en esta animación fue subida por un usuario. Sólo puede ser vista por aquellos que tengan el enlace específico. Si, por alguna razón, quisieras eliminarla, por favor",
      the_song:
        "Esta canción está dedicada a ti, que prefieres un enfoque tranquilo del baile. He creado esta pequeña aplicación para demostrarte cómo hacerlo. Espero que la disfrutes.",
      transform_image: "«  Transformar",
      unable_webgl:
        "No es posible iniciar WebGL. Tu navegador no es compatible.",
      user_generated: "Contenido generado por un usuario",
    }),
    (labels.pt = {
      add_to_playlist: "À música",
      center_of_mouth: "Centro da boca",
      click_here: "clique aqui",
      copied: "Copiado!",
      copy_link: "Copie o link",
      copy_failed: "Não foi possível copiar. Desculpe!",
      edit: "«  Editar",
      make_instruction: "", //"<p>Para melhores resultados, tire umagem com:</p><ul><li>sujeito olhando para frente</li><li>espaço envolta da cabeça inteira</li><li>um fundo neutro</li><li>a boca fechada</li></ul>",
      go: "VAMOS!",
      head_width: "Largura da cabeça",
      hi: "Oi!",
      in_android:
        "Em sistemas Android você também pode compartilhar a página selecionando 'Compartilhar...' no menu do browser na parte superior à direita.",
      in_ios_1: "Nos sistemas iOS você também pode compartilhar clicando",
      in_ios_2: "na Barra de Ferramentas.",
      jawline: "Mandíbula",
      left_of_mouth: "Canto esquerdo na boca",
      left_eyelid: "Pálpebra esquerda",
      make_another: "Faça outro",
      make_your_own: "Faça seu próprio!",
      mark: "Marcar as pálpebras e a boca",
      move_photo:
        "Mover a foto para alinhar com as guias da mandíbula e a largura da cabeça",
      music_maker: "Music maker e programador",
      name_of_person: "Nome da pessoa (opcional)",
      next: "Próximo  »",
      peace_out: "Fui!",
      press_to_copy:
        "Aperte o botão abaixo para copiar o link. Colar em qualquer aplicativo ou mensagem de texto.",
      right_of_mouth: "Canto direto da boca",
      right_eyelid: "Pálpebra direita",
      save_and_share: "Salvar e Compartilhar  »",
      saving: "Salvando ...",
      scale_and_rotate: "Escalar e Girar",
      share: 'Compartilhar este "nod"',
      share_on_facebook: "Compartilhar no Facebook",
      switch_image: "«  Trocar de imagem",
      take_photo: "Pegar / Selecionar foto",
      report:
        "A imagem usada nesta animação foi carregada por um visitante. Só pode ser vista por aqueles que possuem este link específico. Se por aguma razão você quiser removê-la, por favor",
      the_song:
        "Esta cançao é dedicada à você que prefere uma abordagem estacionária para dançar. Eu também fiz este pequeno aplicativo de web para demonstrar como fazer. Espero que você goste.",
      transform_image: "«  Transformar",
      unable_webgl:
        "Incapaz de inicializar WebGL. Seu browser possivelmente não suporta este programa.",
      user_generated: "Conteúdo gerado por usuário",
    }),
    (labels.ja = {
      add_to_playlist: "プレーリストに追加",
      center_of_mouth: "口の中心",
      click_here: "click here",
      copied: "コピーしました！",
      copy_link: "リンクをコピー",
      copy_failed: "コピーできませんでした。ごめんなさい！",
      edit: "«  編集",
      make_instruction: "", //"<p>よりいい結果のために、写真を撮る時に:</p><ul><li>目線まっすぐ</li><li>頭の周りにスペースがあるように</li><li>背景をニュートラルに</li><li>口を閉めたまま</li></ul>",
      go: "行きましょう！",
      head_width: "頭の幅",
      hi: "今日は！",
      in_android:
        "アンドロイドでは、ブラウザのトップ右メニューで”シェア”を選択すれば、このページをシェアすることもできます。",
      in_ios_1: "In iOS you can also share by clicking",
      in_ios_2: "in the toolbar.",
      jawline: "顎線",
      left_of_mouth: "口の左隅",
      left_eyelid: "左眼瞼",
      make_another: "もう一回やる",
      make_your_own: "自分のを作る！",
      mark: "眼瞼と口をマークする",
      move_photo: "顎線と頭幅のガイド線とマッチしているように、写真を動かす。",
      music_maker: "音楽制作とプログラマー",
      name_of_person: "人の名前（オプション）",
      next: "次  »",
      peace_out: "Peace out y'all!",
      press_to_copy:
        "リンクをコピーするために、ボタンを押してください。好きなアプリやテキストメッセージにペーストしてください。",
      right_of_mouth: "口の右隅",
      right_eyelid: "右眼瞼",
      save_and_share: "保存", //"保存してシェアする  »",
      saving: "保存中、、、",
      scale_and_rotate: "移動やスケール",
      share: "この”ノッド”をシェアする",
      share_on_facebook: "Facebookでシェア",
      switch_image: "«  写真を変更する",
      take_photo: "写真を撮る / 選択する",
      report:
        "The image used in this animation was uploaded by a visitor. It can only be viewed by those who have this specific link. If you for some reason would like to remove it, please",
      the_song:
        "この歌は、（あまり）動かない踊りが好きな方に適切です。やり方を見せるために、私はこの簡単なアプリも作りました。エンジョイしてください！",
      transform_image: "«  写真を変形する。",
      unable_webgl:
        "WebGLを初期化できません。お使いのブラウザがサポートしていない可能性があります。",
      user_generated: "ユーザー作成コンテンツ",
    }),
    (labels.fr = {
      add_to_playlist: "La musique",
      center_of_mouth: "Le centre de la bouche",
      click_here: "cliquer ici",
      copied: "Copié!",
      copy_link: "Copier le lien",
      copy_failed: "Ne peut être copier. Désolé!",
      edit: "«  Editer",
      make_instruction: "", //"<p>Pour un meilleur résultat, prenez la photo:</p><ul><li>de face</li><li>avec de l'espace autour de la tête</li><li>avec un fond neutre</li><li>avec la bouche fermée</li></ul>",
      go: "ALLEZ!",
      head_width: "Largeur de la tête",
      hi: "Coucou!",
      in_android:
        "En Android, vous pouvez aussi partager la page en sélectionnant  'Partager..' dans le menu du navigateur en haut à droite.",
      in_ios_1: "En iOS vous pouvez aussi partager en cliquant",
      in_ios_2: "dans la barre d'outils.",
      jawline: "Menton",
      left_of_mouth: "Côté gauche de la bouche",
      left_eyelid: "Paupière gauche",
      make_another: "Faire un autre",
      make_your_own: "Faire le sien!",
      mark: "Marquer les paupières et la bouche",
      move_photo:
        "Déplacez la photo pour aligner avec la mâchoire et la largeur de la tête",
      music_maker: "Music maker et programmeur",
      name_of_person: "Nom de la personne (facultatif)",
      next: "Prochain  »",
      peace_out: "Peace out y'all!",
      press_to_copy:
        "Appuyez le bouton au dessous pour copier le lien, collez dans n'importe quelle application ou texto.",
      right_of_mouth: "Le côté droit de la bouche",
      right_eyelid: "La paupière droite",
      save_and_share: "Partager  »",
      saving: "Enregistrer ...",
      scale_and_rotate: "Échelle et Rotation",
      share: 'Partager ce "nod"',
      share_on_facebook: "Partager sur Facebook",
      switch_image: "«  Changer l'image",
      take_photo: "Prendre / Sélectionner l'image",
      report:
        "L'image utilisée dans cette animation a été téléchargée par un visiteur. Elle ne peut être vu que par ceux qui sont connectés à ce lien . Si pour quelconque raison vous voulez la retirer, s'il vous plaît,",
      the_song:
        "La chanson est dediée à eux qui préfèrent \"une approche stationnaire\" pour dancer. J'ai crée cette application pour démontrer comment procéder. J'espere que vous apprécierez.",
      transform_image: "«  Transformer l'image",
      unable_webgl:
        "Ne peut pas initialiser WebGL. Votre navigateur ne peut pas le supporter.",
      user_generated: "Contenu généré par l'utilisateur",
    });
  var gl,
    fvb,
    fvtcb,
    fvib,
    ft,
    sw = !1,
    lyr =
      ". . . . . . . . . . . . . . . . Nod . to the rhythm . . The minimal . . dance . . . . Nod . to the rhythm . You just let your head bounce . . . . Nod . to the rhythm . . . . The rhythm . is . the boss . . . . . . . . . . . . . . Your head . is connected . . to your spine . is connected . . to your booty . is connected . . to you . . . . . . so your head . is connected . . to your rear it's all connected . . to you . . . . . ...ted to you . . .",
    lyrArr = lyr.split(" "),
    at,
    lang = "en";
  ("?pt" != location.search && "pt" != navigator.language.substring(0, 2)) ||
    (lang = "pt"),
    ("?es" != location.search && "es" != navigator.language.substring(0, 2)) ||
      (lang = "es"),
    ("?ja" != location.search && "ja" != navigator.language.substring(0, 2)) ||
      (lang = "ja"),
    ("?fr" != location.search && "fr" != navigator.language.substring(0, 2)) ||
      (lang = "fr"),
    $(window).ready(function () {
      $("a.close").click(function (e) {
        $(this).parent().fadeToggle(100),
          getCookie("created") == id && (document.cookie = "created=0;path=/"),
          e.preventDefault();
      });
    }),
    $(window).ready(function () {
      $("[class^='label--']").each(function () {
        var e = $(this).attr("class").split(" ")[0].replace("label--", "");
        $(this).is("input")
          ? $(this).val(labels[lang][e])
          : $(this).prepend(labels[lang][e]);
      });
    });

  function nod_init(e, a) {
    (nc = document.getElementById("nod-canvas")), (gl = null);
    try {
      gl = nc.getContext("experimental-webgl");
    } catch (e) {}
    if (gl) {
      gl.clearColor(0, 0, 0, 1),
        gl.clearDepth(1),
        gl.enable(gl.DEPTH_TEST),
        gl.depthFunc(gl.LEQUAL),
        gl_initShaders(),
        nod_initBuffers(a),
        nod_initTextures(e),
        gl_makePerspective(45, 0.75, 0.1, 100),
        nod_drawScene();
    } else alert(labels[lang].unable_webgl);
  }
  var vcs;

  function nod_initBuffers(e) {
    var a = [
      0,
      1024,
      96,
      1024,
      192,
      1024,
      288,
      1024,
      384,
      1024,
      480,
      1024,
      576,
      1024,
      672,
      1024,
      768,
      1024,
      0,
      878,
      116,
      841,
      192,
      930,
      288,
      988,
      384,
      1005,
      480,
      990,
      576,
      936,
      653,
      839,
      768,
      878,
      0,
      732,
      130,
      700,
      e[0] - 41,
      e[1] + 30 + 15,
      e[0] + 41,
      e[1] + 30 + 15,
      (e[0] + e[2]) / 2,
      (e[1] + e[3]) / 2 + 30 + 15,
      e[2] - 41,
      e[3] + 30 + 15,
      e[2] + 41,
      e[3] + 30 + 15,
      638,
      700,
      768,
      732,
      0,
      586,
      130,
      620,
      e[0] - 41 - 25,
      e[1] + 30,
      e[0] + 41,
      e[1] + 30,
      (e[0] + e[2]) / 2,
      (e[1] + e[3]) / 2 + 30,
      e[2] - 41,
      e[3] + 30,
      e[2] + 41 + 25,
      e[3] + 30,
      638,
      620,
      768,
      586,
      0,
      440,
      130,
      550,
      e[0] - 41,
      e[1] - 22.5,
      e[0] + 41,
      e[1] - 22.5,
      (e[0] + e[2]) / 2,
      (e[1] + e[3] + e[7] + e[7]) / 4,
      e[2] - 41,
      e[3] - 22.5,
      e[2] + 41,
      e[3] - 22.5,
      638,
      550,
      768,
      440,
      0,
      294,
      172,
      345,
      e[4],
      e[5],
      (e[4] + e[6]) / 2,
      (e[5] + 5 * e[7]) / 6,
      e[6],
      e[7],
      (e[6] + e[8]) / 2,
      (e[9] + 5 * e[7]) / 6,
      e[8],
      e[9],
      599,
      354,
      768,
      294,
      0,
      146,
      180,
      190,
      240,
      230,
      312,
      173,
      373,
      156,
      456,
      173,
      528,
      230,
      588,
      190,
      768,
      146,
      0,
      80,
      180,
      160,
      240,
      140,
      312,
      100,
      373,
      80,
      456,
      100,
      528,
      140,
      588,
      160,
      768,
      80,
      0,
      0,
      96,
      0,
      192,
      0,
      288,
      0,
      384,
      0,
      480,
      0,
      576,
      0,
      672,
      0,
      768,
      0,
    ];
    for (i = 48; i <= 50; i++) {
      var t = (a[2 * i] + a[2 * (i - 1)]) / 2,
        o = (a[2 * i + 1] + a[2 * (i - 1) + 1]) / 2;
      a.push(t, o),
        (t = a[2 * i]),
        (o = a[2 * i + 1]),
        a.push(t, o),
        50 == i &&
          ((t = (a[2 * i] + a[2 * (i + 1)]) / 2),
          (o = (a[2 * i + 1] + a[2 * (i + 1) + 1]) / 2),
          a.push(t, o));
    }
    i = 29;
    (t = a[2 * i] + 25), (o = a[2 * i + 1]);
    a.push(t, o), (i = 33);
    (t = a[2 * i] - 25), (o = a[2 * i + 1]);
    for (
      a.push(t, o),
        fvb = gl.createBuffer(),
        gl.bindBuffer(gl.ARRAY_BUFFER, fvb),
        vcs = [],
        i = 0;
      i < a.length / 2;
      i++
    ) {
      (t = a[2 * i]), (o = a[2 * i + 1]);
      vcs.push((3 * t) / 768 - 1.5, (4 * o) / 1024 - 2, 1.17);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vcs), gl.STATIC_DRAW),
      (fvtcb = gl.createBuffer()),
      gl.bindBuffer(gl.ARRAY_BUFFER, fvtcb);
    var r = [];
    for (i = 0; i < a.length / 2; i++) {
      (t = a[2 * i]), (o = a[2 * i + 1]);
      r.push(t / 768, 1 - o / 1024);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(r), gl.STATIC_DRAW),
      (fvib = gl.createBuffer()),
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fvib);
    var n = [];
    for (o = 0; o < 8; o++)
      for (t = 0; t < 8; t++)
        2 == o && 2 == t
          ? (n.push(t + 9 * o, 88, t + 9 * o + 9, t + 9 * o + 1, t + 9 * o, 88),
            n.push(t + 9 * o + 1, t + 9 * o + 10, 88))
          : 2 == o && 5 == t
          ? (n.push(t + 9 * o, 89, t + 9 * o + 9, t + 9 * o + 1, t + 9 * o, 89),
            n.push(t + 9 * o + 1, t + 9 * o + 10, 89))
          : 3 == o && 2 == t
          ? (n.push(
              t + 9 * o,
              88,
              t + 9 * o + 9,
              88,
              t + 9 * o + 9,
              t + 9 * o + 10
            ),
            n.push(t + 9 * o + 1, t + 9 * o + 10, 88))
          : 3 == o && 5 == t
          ? (n.push(
              t + 9 * o,
              89,
              t + 9 * o + 9,
              89,
              t + 9 * o + 9,
              t + 9 * o + 10
            ),
            n.push(t + 9 * o + 1, t + 9 * o + 10, 89))
          : 5 == o && t >= 2 && t <= 5
          ? 2 == t
            ? (n.push(
                t + 9 * o,
                t + 9 * o + 34,
                t + 9 * o + 9,
                t + 9 * o + 34,
                t + 9 * o + 9,
                t + 9 * o + 10
              ),
              n.push(t + 9 * o + 34, t + 9 * o + 35, t + 9 * o + 10))
            : 3 == t
            ? (n.push(
                t + 9 * o + 34,
                t + 9 * o + 35,
                t + 9 * o + 9,
                t + 9 * o + 35,
                t + 9 * o + 9,
                t + 9 * o + 10
              ),
              n.push(t + 9 * o + 35, t + 9 * o + 36, t + 9 * o + 10))
            : 4 == t
            ? (n.push(
                t + 9 * o + 35,
                t + 9 * o + 36,
                t + 9 * o + 9,
                t + 9 * o + 36,
                t + 9 * o + 9,
                t + 9 * o + 10
              ),
              n.push(t + 9 * o + 36, t + 9 * o + 37, t + 9 * o + 10))
            : 5 == t &&
              (n.push(
                t + 9 * o + 36,
                t + 9 * o + 37,
                t + 9 * o + 9,
                t + 9 * o + 37,
                t + 9 * o + 9,
                t + 9 * o + 10
              ),
              n.push(t + 9 * o + 37, t + 9 * o + 1, t + 9 * o + 10))
          : (t < 4 && o < 5) || (t > 4 && o > 4)
          ? n.push(
              t + 9 * o,
              t + 9 * o + 1,
              t + 9 * o + 9,
              t + 9 * o + 1,
              t + 9 * o + 9,
              t + 9 * o + 10
            )
          : n.push(
              t + 9 * o,
              t + 9 * o + 10,
              t + 9 * o + 9,
              t + 9 * o + 1,
              t + 9 * o,
              t + 9 * o + 10
            );
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(n), gl.STATIC_DRAW);
  }

  function nod_initTextures(e) {
    ft = gl.createTexture();
    var a = new Image();
    (a.onload = function () {
      nod_handleTextureLoaded(a, ft);
    }),
      (a.src = e);
  }

  function nod_handleTextureLoaded(e, a) {
    gl.bindTexture(gl.TEXTURE_2D, a),
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, e),
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      ),
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR),
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
      gl.generateMipmap(gl.TEXTURE_2D),
      gl.bindTexture(gl.TEXTURE_2D, null);
  }
  var posx = -2,
    fr = 0,
    xfr = 0,
    lc = 1,
    lci = !1,
    tw = 0,
    ttw = 0,
    un = 0;

  function nod_drawScene() {
    a = rhy;
    if (a > 0) $("div.play").css("display", "none");
    else {
      var t = parseFloat($("div.play").css("opacity"));
      t < 0.6 && ((t += 0.04), $("div.play").css("opacity", t));
    }
    a < 1 && lci
      ? ((lci = !1), 3 == ++lc && (e.playbackRate = 0.5), 4 == lc && e.pause())
      : a > 1 && (lci = !0);
    var o = parseInt(4.267 * a);
    if (2 == lc) {
      o > 64 && (o -= 64),
        o > 138 && (o -= 64),
        "." == lyrArr[o] && o > 0 && (o -= 1),
        "." == lyrArr[o] && o > 0 && (o -= 1);
      var r = lyrArr[o];
      "." == r && (r = "");
      var n = -10 * Math.sin(0.6 + 6.702 * a);
      Math.cos(0.6 + 6.702 * a) < 0 && (n = -n),
        $(".lyrics").css({
          display: "block",
          left: Math.floor(1.1 * Math.random() + 45) + "%",
          filter: "blur(" + (0.1 * Math.random() + 0) + "em)",
          transform: "rotate(" + n + "deg)",
        }),
        $(".lyrics").text(r);
    }
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
      gl_loadIdentity(),
      gl_mvTranslate([-0, 0, -6]);
    var l = vcs.slice(),
      s = new Date();
    (tttw = 0.5 * Math.sin(2 + 13 * a) + 0.5 * Math.sin(0.5 * a)),
      (ttw += (tttw - ttw) / 50),
      (tw += (ttw - tw) / 5),
      (un *= 0.99);
    var d = 0,
      m = 0;
    if (a < 3 || (a > 14.5 && a < 18.5) || (a > 29 && a < 33)) d = 0.4;
    else if (a > 33) {
      if (((d = 0.8), (a > 39.6 && a < 41) || (a > 54.5 && a < 56))) {
        var h = a;
        a > 54.5 && (h -= 1), (m = (h - 0.4) % 0.617 < 0.308 ? -0.3 : 0.3);
      }
    } else (a + 0.4) % 3.7 < 1.85 && (d = 1);
    (fr += (d - fr) / 10),
      (xfr += (m - xfr) / 8),
      (l[61] = l[61] - 0.06 + 0.12 * (fr + 2.5 * xfr)),
      (l[63] = l[63] + 0.05 * (fr + xfr)),
      (l[64] = l[64] - 0.06 + 0.16 * (fr + xfr)),
      (l[67] = l[67] - 0.06 + 0.16 * fr),
      (l[69] = l[69] - 0.05 * (fr - xfr)),
      (l[70] = l[70] - 0.06 + 0.16 * (fr - xfr)),
      (l[73] = l[73] - 0.06 + 0.12 * (fr - 2.5 * xfr)),
      (l[88] = l[88] - 0.04 + 0.08 * (fr + 2 * xfr)),
      (l[91] = l[91] - 0.03 + 0.03 * (fr + xfr)),
      (l[97] = l[97] - 0.03 + 0.03 * (fr - xfr)),
      (l[100] = l[100] - 0.04 + 0.08 * (fr - 2 * xfr)),
      (l[265] = l[265] - 0.04 + 0.08 * (fr + xfr)),
      (l[268] = l[268] - 0.04 + 0.08 * (fr - xfr));
    var g = 16 * ((s.getSeconds() % 8) + s.getMilliseconds() / 1e3);
    g <= 3.15 &&
      ((l[265] = l[265] + Math.cos(1.59 + g) / 4),
      (l[91] = l[91] + Math.cos(1.59 + g) / 6),
      (l[97] = l[97] + Math.cos(1.59 + g) / 6),
      (l[268] = l[268] + Math.cos(1.59 + g) / 4));
    var p = -1;
    if (textLength < agentCs.length / 0.47) {
      a > 47
        ? (p = parseInt(30 * (a - 33)))
        : a > 18.1
        ? (p = parseInt(30 * (a - 18.1)))
        : a > 3.1 && (p = parseInt(30 * (a - 3.1))),
        (mxd = 600),
        (myd = 800),
        a > 16 &&
          a <= 18.1 &&
          ((mxd += 1e4 * (a - 16)), (myd += 1e4 * (a - 16))),
        a > 62 && ((mxd += 1e4 * (a - 62)), (myd += 1e4 * (a - 62))),
        p >= 0 &&
          nm[0].x.length > p &&
          ((l[141] = l[141] + nm[0].x[p] / mxd),
          (l[142] = l[142] - nm[0].y[p] / myd),
          (l[145] = l[145] - nm[1].y[p] / myd),
          (l[148] = l[148] - nm[2].y[p] / myd),
          (l[151] = l[151] - nm[3].y[p] / myd),
          (l[153] = l[153] + nm[4].x[p] / mxd),
          (l[154] = l[154] - nm[4].y[p] / myd),
          (l[246] = l[246] + nm[5].x[p] / mxd),
          (l[247] = l[247] + 0.02 - nm[5].y[p] / myd),
          (l[248] = l[248] - 0.06),
          (l[252] = l[252] + nm[6].x[p] / mxd),
          (l[253] = l[253] + 0.03 - nm[6].y[p] / myd),
          (l[254] = l[254] - 0.06),
          (l[258] = l[258] + nm[7].x[p] / mxd),
          (l[259] = l[259] + 0.02 - nm[7].y[p] / myd),
          (l[260] = l[260] - 0.06),
          (l[243] = (l[141] + l[246]) / 2),
          (l[244] = (l[142] + l[247] + l[247]) / 3),
          (l[245] = l[245] - 0.06),
          (l[249] = (l[246] + l[252]) / 2),
          (l[250] = (l[247] + l[253] + l[253]) / 3),
          (l[251] = l[251] - 0.06),
          (l[255] = (l[252] + l[258]) / 2),
          (l[256] = (l[253] + l[253] + l[259]) / 3),
          (l[257] = l[257] - 0.06),
          (l[261] = (l[258] + l[153]) / 2),
          (l[262] = (l[259] + l[259] + l[154]) / 3),
          (l[263] = l[263] - 0.06),
          (l[171] = l[171] + nm[5].x[p] / (2 * mxd)),
          (l[172] = l[172] - nm[5].y[p] / (2 * myd)),
          (l[175] = l[175] - nm[6].y[p] / (2 * myd)),
          (l[177] = l[177] + nm[7].x[p] / (2 * mxd)),
          (l[178] = l[178] - nm[7].y[p] / (2 * myd)));
      autoShake(1);
    }
    var b = 0.08 * tw;
    for (i = 28; i <= 270; i += 3) {
      if ((i < 219 && i % 27 != 1 && i % 27 != 25) || i > 243) {
        var _ = l[i - 1] * Math.cos(b) - (l[i] + 1.8) * Math.sin(b),
          f = (l[i] + 1.8) * Math.cos(b) + l[i - 1] * Math.sin(b);
        (l[i] = f - 1.8), (l[i - 1] = _);
      }
    }
    if (rhy > setStart + 2) {
      rhy = setStart;
    }
    rhy = rhy + 1;
    textLength = textLength + 1;
    gl.bindBuffer(gl.ARRAY_BUFFER, fvb),
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(l)),
      gl.vertexAttribPointer(gl_vertexPositionAttribute, 3, gl.FLOAT, !1, 0, 0),
      gl.bindBuffer(gl.ARRAY_BUFFER, fvtcb),
      gl.vertexAttribPointer(gl_textureCoordAttribute, 2, gl.FLOAT, !1, 0, 0),
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, fvib),
      gl_setMatrixUniforms(),
      //口の中の色を変更可能
      gl.clearColor(0.5, 0, 0, 1),
      gl.activeTexture(gl.TEXTURE0),
      gl.bindTexture(gl.TEXTURE_2D, ft),
      gl.drawElements(gl.TRIANGLES, 408, gl.UNSIGNED_SHORT, 0),
      // setTimeoutで口を動かすスピードを調整可能
      (at = setTimeout(nod_drawScene, 100));
  }

  var hi, visch;
  void 0 !== document.hidden
    ? ((hi = "hidden"), (visch = "visibilitychange"))
    : void 0 !== document.msHidden
    ? ((hi = "msHidden"), (visch = "msvisibilitychange"))
    : void 0 !== document.webkitHidden &&
      ((hi = "webkitHidden"), (visch = "webkitvisibilitychange"));

  function handleVisibilityChange() {}

  void 0 === document.addEventListener ||
    void 0 === document.hidden ||
    document.addEventListener(visch, handleVisibilityChange, !1),
    document.addEventListener(
      "mousemove",
      function (e) {
        (tttw = -5 * (e.pageX / window.innerWidth - 0.5)),
          (ttw += (tttw - ttw) / 10),
          (tun = -5 * (e.pageY / window.innerHeight - 0.75)),
          (un += (tun - un) / 10),
          e.preventDefault();
      },
      !1
    ),
    document.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
        var a = e.changedTouches[0];
        (ttw = -5 * (a.clientX / window.innerWidth - 0.5)),
          Math.abs(ttw) > 1 && (sw = !0),
          (tun = -5 * (a.clientY / window.innerHeight - 0.75)),
          (un += (tun - un) / 5);
      },
      !1
    );

  function autoShake(moveLN) {
    moveLNum = moveLN;
    moveL1();
  }

  function moveL2() {
    var thisX = 1,
      thisY = window.innerHeight / 2;
    var moveLoop1 = setInterval(function () {
      (tttw = -5 * (thisX / window.innerWidth - 0.5)),
        (ttw += (tttw - ttw) / 10),
        (tun = -5 * (thisY / window.innerHeight - 0.75)),
        (un += (tun - un) / 10);
      if (thisX > window.innerWidth * 0.5) {
        clearInterval(moveLoop1);
        toStopNum = toStopNum + 1;
        moveL1();
      }
      thisX = thisX + 1;
    }, 1);
  }

  function moveL1() {
    var thisX = window.innerWidth,
      thisY = window.innerHeight / 2;
    if (toStopNum < moveLNum) {
      var moveLoop2 = setInterval(function () {
        (tttw = -5 * (thisX / window.innerWidth - 0.5)),
          (ttw += (tttw - ttw) / 10),
          (tun = -5 * (thisY / window.innerHeight - 0.75)),
          (un += (tun - un) / 10);
        if (thisX < window.innerWidth * 0.5) {
          clearInterval(moveLoop2);
          moveL2();
        }
        thisX = thisX - 1;
      }, 1);
    } else {
      toStopNum = 0;
      moveLNum = 0;
    }
  }
}

function checkDefaultExist() {
  resetAgentImgFace(agentImgFace);
}

function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  return format;
}

function sleep(time) {
  // 1 second => 1000
  const d1 = new Date();
  while (true) {
    const d2 = new Date();
    if (d2 - d1 > time) {
      return;
    }
  }
}
