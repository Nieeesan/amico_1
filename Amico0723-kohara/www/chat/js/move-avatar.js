// ================================================== プログラム最小化用 ==================================================
// サーバURL
const ID_VALIDATION_URL =
 // "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoValidateId.php";//
 "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoValidateId.php";
const CHECK_EVENT_URL =
  "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoCheckEvent.php";
const SEND_TEXT_URL =
  "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoText.php";
const SEND_STAMP_URL =
  "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoStamp.php";
const MSG_DELETE_URL =
  "https://klabo-robo.jp/amico/kohara/Amico_kohara/api/amicoMsgDelete.php";

MY_AMICO_ID = "dummy"; //初回起動時にファイルから読み込まれる

const NEW_MSG_AUDIO = "chat/audio/new-msg.mp3";
let NEW_MSG_CNT = 0;
let isTapped = false;
let isSpeaking = false;
let latestTimestamp = 0000000000000;

initialize();

// ================================================== 初期化 ==================================================
// 初期化
function initialize() {
  changeVisibility(true, "amicoIdRegistration");

  // amicoIdが登録されているかチェック
  document.addEventListener(
    "deviceready",
    function () {
      // amicoIdをファイルから取得する
      window.requestFileSystem(
        LocalFileSystem.PERSISTENT,
        0,
        function (fs) {
          fs.root.getFile(
            "my_amico_id.txt",
            { create: false, exclusive: false },
            function (fileEntry) {
              // my_amico_id.txtにamicoIdを読み込む
              fileEntry.file(
                function (file) {
                  var reader = new FileReader();

                  reader.onloadend = function () {
                    const amicoId = this.result;
                    console.log("amico id: " + amicoId);
                    if (amicoId != "") {
                      // amicoIdが利用可能かどうかをサーバに問い合わせ
                      validateAmicoId("existing", amicoId).then((result) => {
                        if (result) {
                          MY_AMICO_ID = amicoId; // amicoIdを設定
                          // alert("MY_AMICO_ID: " + MY_AMICO_ID);
                          changeVisibility(false, "amicoIdRegistration"); // 登録画面を隠す
                        } else {
                          alert(
                            "登録されているamico IDが無効です。\n有効なamico IDを登録してください。"
                          );
                        }
                      });
                    } else {
                      alert("amico IDが登録されていません。");
                    }
                  };

                  reader.readAsText(file);
                },
                function () {
                  alert("amico IDの読み込みに失敗しました。");
                  console.error("Failed to read my_amico_id.txt.");
                }
              );
            },
            function () {
              alert("amico IDが登録されていません。");
              console.error("No file: my_amico_id.txt.");
            }
          );
        },
        function () {
          alert("amico IDの読み込みに失敗しました。");
          console.error("File System Error");
        }
      );
    },
    false
  );

  // 各画面を隠す
  changeVisibility(false, "enlargedMedia");
  changeVisibility(false, "sttBalloon");

  // 起動時の処理
  document.getElementById("agent").onload = function () {
    var agentIfr2 = document.getElementById("agent").contentWindow;
    setTimeout(function () {
      agentIfr2.document.getElementById("beforeFinished").click();
    }, 100);
    setTimeout(function () {
      agentIfr2.document.getElementById("finished").click();
    }, 100);
    setTimeout(function () {
      // 読み込み画面を隠す
      changeVisibility(false, "loading");
    }, 1300);

    // イベントチェックを開始する
    setTimeout(function () {
      checkEvent();
    }, 1300);

    var agentIfr = $("#agent")[0].contentDocument;
    $("#finished", agentIfr).click(function () {
      document.getElementById("agent").style.width = "45%";
    });
    $("#reset", agentIfr).click(function () {
      document.getElementById("agent").style.width = "100%";
    });
  };
}

// ================================================== amico ID検証 ==================================================
// amicoId登録画面で「登録」ボタンが押されたときに呼ばれる
function registerAmicoId() {
  const amicoId = document.getElementById("amicoIdInputTag").value;
  // console.log("amico id: ", amicoId);
  if (amicoId == "") {
    alert("amico IDを入力してください。");
  } else {
    validateAmicoId("new", amicoId).then((result) => {
      console.log("--validate: ", result);
      if (result) {
        // my_amico_id.txtにamicoIdを書き込む
        window.requestFileSystem(
          LocalFileSystem.PERSISTENT,
          0,
          function (fs) {
            fs.root.getFile(
              "my_amico_id.txt",
              { create: true, exclusive: false },
              function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                  fileWriter.onwriteend = function () {
                    console.log(
                      "amico ID was successfully written to my_amico_id.txt."
                    );
                    MY_AMICO_ID = amicoId; // amicoIdを設定
                    alert("amico ID [" + MY_AMICO_ID + "] を登録しました。");
                    changeVisibility(false, "amicoIdRegistration"); // 登録画面を隠す
                  };
                  fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                    alert("amico ID [" + amicoId + "] の登録に失敗しました。");
                  };

                  const dataObj = new Blob([amicoId], {
                    type: "text/plain",
                  });
                  fileWriter.write(dataObj);
                });
              },
              function () {
                console.error("Failed to create a file");
                alert("amico ID [" + amicoId + "] の登録に失敗しました。");
              }
            );
          },
          function () {
            console.error("File System Error");
            alert("amico ID [" + amicoId + "] の登録に失敗しました。");
          }
        );
      } else {
        alert("amico IDが無効です。");
      }
    });
  }
}

// amicoIdが利用可能かどうかをサーバに問い合わせ
function validateAmicoId(type, amicoId) {
  console.log("validating...", amicoId);
  const data = {
    type: type,
    amico_id: amicoId,
  };
  const param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  return fetch(ID_VALIDATION_URL, param)
    .then((response) => response.json())
    .then((data) => {
      const validation = data[0].result;
      if (type == "new") {
        // alert(data[0].message);
      }
      // console.log("validation:", validation);
      if (validation) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      console.error("ID validation error:", error);
      return false;
    });
}

// ================================================== メッセージ読み上げ・送信 ==================================================
// アバター画像がタップされた場合に実行される
function avatarClicked() {
  disableTriggerArea(true);
  if (NEW_MSG_CNT > 0) {
    isSpeaking = true;
    changeVisibility(false, "stampBox");

    readNewMsg().then(() => {
      setTimeout(function () {
        isSpeaking = false;
      }, 3000);
      setTimeout(function () {
        changeVisibility(true, "stampBox");
      }, 500);
      disableTriggerArea(false);
    });
  } else {
    // テキスト送信モードの場合
    isSpeaking = true;
    startTextMode().then(() => {
      setTimeout(function () {
        isSpeaking = false;
      }, 3000);
    });
  }
}

// スタンプがタップされたときに実行される
function sendStamp(content) {
  // すでにタップされている場合
  if (isTapped) {
    return;
  }

  myInitialize();

  let stampName = "";
  switch (content) {
    case "good-morning":
      stampName = "おはよう";
      break;

    case "ok":
      stampName = "OK";
      break;

    case "thanks":
      stampName = "ありがとう";
      break;

    case "good-night":
      stampName = "おやすみ";
      break;

    default:
      return;
  }

  sendStampToServer("stamp", content)
    .then(() => {
      letSpeak(stampName + "スタンプを送信しました。")
        .then(() => {
          myFinalize();
        })
        .catch(() => {
          myFinalize();
        });
    })
    .catch(() => {
      letSpeak(stampName + "スタンプの送信に失敗しました。")
        .then(() => {
          myFinalize();
        })
        .catch(() => {
          myFinalize();
        });
    });

  function myInitialize() {
    isTapped = true;
    changeVisibility(false, "stampBox");
    isSpeaking = true;
    disableTriggerArea(true);
  }

  function myFinalize() {
    setTimeout(function () {
      isTapped = false;
      changeVisibility(true, "stampBox");
      isSpeaking = false;
      disableTriggerArea(false);
    }, 500);
  }
}

// 新着メッセージを読み上げる
function readNewMsg() {
  return new Promise((resolve, reject) => {
    let isSpeechEnd = true;
    letSpeak(NEW_MSG_CNT + "件の新着メッセージがあります。").then(() => {
      // letSpeak("").then(() => {
      // チャットログを最新状態に更新する
      (function () {
        const id = setInterval(function () {
          const msgData = document.querySelector(".msgData");
          if (msgData === null) {
            clearInterval(id);
            resolve();
          } else {
            if (isSpeechEnd) {
              // 新着メッセージ一時保持要素から各メッセージデータを取得する
              const timestamp = msgData.querySelector(".timestamp").innerText;
              const userName = msgData.querySelector(".userName").innerText;
              const messageType =
                msgData.querySelector(".messageType").innerText;
              const oppContents =
                msgData.querySelector(".oppContents").innerText;
              const msgId = msgData.querySelector(".msgId").innerText;

              // スピーチ原稿生成
              let speechScript = userName + "さんから";
              switch (messageType) {
                case "text":
                  speechScript += "です。";
                  isSpeechEnd = false;
                  letSpeak(speechScript).then(() => {
                    setTimeout(function () {
                      speechScript = oppContents;
                      letSpeak(speechScript).then(() => {
                        finishOneMsg(msgId, msgData);
                      });
                    }, 500);
                  });
                  break;

                case "image":
                  speechScript += "です。";
                  isSpeechEnd = false;
                  letSpeak(speechScript).then(() => {
                    setTimeout(function () {
                      const imgElem = createImg(oppContents);
                      startEnlargedMedia("image", imgElem).then(() => {
                        finishOneMsg(msgId, msgData);
                      });
                    }, 500);
                  });
                  break;

                case "video":
                  speechScript += "です。";
                  isSpeechEnd = false;
                  letSpeak(speechScript).then(() => {
                    setTimeout(function () {
                      const videoElem = createVideo(oppContents);
                      startEnlargedMedia("video", videoElem).then(() => {
                        finishOneMsg(msgId, msgData);
                      });
                    }, 500);
                  });
                  break;

                default:
                  break;
              }
            }
          }
        }, 500);
      })();
      function finishOneMsg(msgId, msgData) {
        requestMsgDelete(msgId); // サーバにDBからのメッセージ削除をリクエスト
        msgData.remove();
        setTimeout(function () {
          changeNewMsgCnt(-1);
          isSpeechEnd = true;
        }, 700);
      }
    });
  });
}

// マイク使用許可取得
function getMicPermission(mode) {
  return new Promise((resolve, reject) => {
    // マイク使用許可要求
    window.plugins.speechRecognition.isRecognitionAvailable(
      function (available) {
        if (available) {
          window.plugins.speechRecognition.requestPermission(
            function (res) {
              console.log("Got mic permission.");
              resolve();
            },
            function (err) {
              console.error(err);
              reject();
            }
          );
        }
      },
      function (err) {
        console.error(err);
        alert("音声入力プラグインが利用できません。");
        reject();
      }
    );
  });
}
// パーミッションをリクエストする
function getStoragePermission() {
  showDebugMsg("getPermissions is called.");
  return new Promise((resolve, reject) => {
    let permissions = cordova.plugins.permissions;
    let list = [permissions.WRITE_EXTERNAL_STORAGE];
    permissions.checkPermission(list, success, error);

    function success(status) {
      if (!status.hasPermission) {
        permissions.requestPermissions(
          list,
          function (status) {
            if (!status.hasPermission) {
              error();
            } else {
              console.log("Got storage permission.");
              resolve();
            }
          },
          error
        );
      }
    }

    function error() {
      console.error("Storage permission error.");
      reject();
    }
  });
}

// テキスト送信モード開始
function startTextMode() {
  return new Promise((resolve, reject) => {
    // 文字変換モード開始時の処理
    changeVisibility(false, "newMsgCnt");
    changeVisibility(false, "stampBox");
    disableTriggerArea(true);

    getMicPermission("text")
      .then(() => {
        letSpeak("メッセージをどうぞ。").then(() => {
          setTimeout(function () {
            startStt();
          }, 500);
        });
      })
      .catch(() => {
        letSpeak("文字変換のために、音声の録音を許可してください。").then(
          () => {
            finalizeTextMode().then(() => {
              resolve();
            });
          }
        );
      });

    // 文字変換開始
    function startStt() {
      // パラメータ設定
      let mic_options = {
        language: "ja-JP",
        matches: 1,
        showPopup: false,
      };

      // 音声入力 開始
      // Google STTサービスの認識開始音が再生されるくらいのタイミングで吹き出しを表示
      setTimeout(function () {
        changeVisibility(true, "sttBalloon");
      }, 700);
      let text = "";
      if (monaca.isAndroid) {
        window.plugins.speechRecognition.startListening(
          function (result) {
            stopListening();

            changeVisibility(false, "sttBalloon");

            setTimeout(function () {
              for (let i = 0; i < result.length; i++) {
                text += result[i];
              }
              console.log("STT result: " + text);
              // テキストを送信する
              sendTextToServer("text", text)
                .then(() => {
                  letSpeak("メッセージを承りました。").then(() => {
                    finalizeTextMode().then(() => {
                      resolve();
                    });
                  });
                })
                .catch(() => {
                  letSpeak("メッセージの送信に失敗しました。").then(() => {
                    finalizeTextMode().then(() => {
                      resolve();
                    });
                  });
                });
              // });
            }, 500);
          },
          function (result) {
            stopListening();
            console.log("STT error\n" + JSON.stringify(result));
            changeVisibility(false, "sttBalloon");
            setTimeout(function () {
              letSpeak("上手く聞き取れませんでした。").then(() => {
                finalizeTextMode().then(() => {
                  resolve();
                });
              });
            }, 500);
            return;
          },
          mic_options
        );
      } else {
        alert("OSが音声認識に対応していません。");
        console.log("Cannot use STT due to the unsupported OS.");
      }
    }
  });

  // 複数回認識不具合対処のため、Androidでも試しにstopListiningを呼ぶ
  function stopListening() {
    window.plugins.speechRecognition.stopListening(
      function () {
        console.log("SpeechRecognition has been stopped.");
      },
      function () {
        console.error("SpeechRecognition has not been stopped.");
      }
    );
  }

  // 文字変換モード終了時の処理
  function finalizeTextMode() {
    return new Promise((resolve, reject) => {
      changeVisibility(true, "newMsgCnt");
      changeVisibility(true, "stampBox");
      disableTriggerArea(false);
      resolve();
    });
  }
}

// 新着メッセージ件数を変更する
function changeNewMsgCnt(cnt) {
  elem = document.getElementById("newMsgCnt");
  NEW_MSG_CNT += cnt;
  elem.innerText = NEW_MSG_CNT;

  if (NEW_MSG_CNT != 0) {
    elem.classList.remove("new-msg-no");
    elem.classList.add("new-msg-yes");
  } else {
    elem.classList.remove("new-msg-yes");
    elem.classList.add("new-msg-no");
  }
}
// contentsの内容を発話させる
function letSpeak(contents) {
  return new Promise((resolve, reject) => {
    TTS.speak({
      text: contents,
      locale: "ja-JP",
      rate: 0.7,
    }).then(function () {
      moveAvatarMouth(""); // 口の動作を強制終了
      return resolve();
    }),
      function (reason) {
        console.log("TTS failed.\n" + reason);
        moveAvatarMouth(""); // 口の動作を強制終了
        return reject();
      };

    // 発話時間調整
    for (let i = 0; i < 200; i++) {
      contents += " ";
    }

    // 口を動かす
    moveAvatarMouth(contents);
  });
}

// アバターの口を動かす
function moveAvatarMouth(contents) {
  let agentIfr = document.getElementById("agent").contentWindow;
  agentIfr.giveAgentCs(contents);
}

// 新着メッセージをHTML要素に格納する
function saveNewMsgToHTML(
  timestamp,
  userName,
  messageType,
  oppContents,
  msgId
) {
  const newMsgContainer = document.getElementById("newMsgContainer");
  newMsgContainer.innerHTML +=
    "<div class='msgData'><p class='timestamp'>" +
    timestamp +
    "</p><p class='userName'>" +
    userName +
    "</p><p class='messageType'>" +
    messageType +
    "</p><p class='oppContents'>" +
    oppContents +
    "</p><p class='msgId'>" +
    msgId +
    "</p></div>";
}

// トリガーとなるアバタータップ操作を有効化/無効化する
function disableTriggerArea(disable) {
  const triggerArea = document.getElementById("avatarOverlay");
  if (disable) {
    triggerArea.classList.add("not-react");
  } else {
    triggerArea.classList.remove("not-react");
  }
}
// ================================================== サーバー送受信 ==================================================
// amicoCheckEvent.phpに定期アクセスして新しいイベントを取得する
function checkEvent() {
  // n秒ごとに繰り返し
  setInterval(function () {
    if (!isSpeaking) {
      getEventData(latestTimestamp);
    }
  }, 1000);

  // fetchでcheckEvent.phpからJSON形式のイベントデータを取得する
  function getEventData(timestamp) {
    isChatLogEnd = false;

    const data = { amico_id: MY_AMICO_ID, latest_timestamp: timestamp };
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    };

    fetch(CHECK_EVENT_URL, param)
      .then((response) => response.json())
      .then((data) => {
        let data_length = Object.keys(data).length;
        if (data_length > 0) {
          latestTimestamp = data[data_length - 1].timestamp;
          console.log(JSON.stringify(data), data_length);
          for (let i = 0; i < data_length; i++) {
            src = data[i].src;
            switch (src) {
              case "family":
                saveNewMsgToHTML(
                  data[i].timestamp,
                  data[i].userName,
                  data[i].messageType,
                  data[i].content,
                  data[i].msgId
                );
                changeNewMsgCnt(1);
                break;

              default:
                break;
            }
          }
          // 通知音を鳴らす
          (function () {
            const media = new Media(
              getPath() + NEW_MSG_AUDIO,
              onSuccess,
              onError
            );

            function getPath() {
              var str = location.pathname;
              var i = str.lastIndexOf("/");
              return str.substring(0, i + 1);
            }

            function onSuccess() {
              // console.log("new-msg-audio success");
            }

            function onError(error) {
              console.error("new-msg-audio error:" + JSON.stringify(error));
            }

            media.play();
          })();
        }
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }
}

// サーバに読み上げ終了後のメッセージ削除をリクエスト
function requestMsgDelete(msgId) {
  console.log(msgId);
  const data = { msg_id: msgId };
  const param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };

  fetch(MSG_DELETE_URL, param)
    .then((response) => response.json())
    .then((data) => {
      console.log("result:", data[0].message);
    })
    .catch((error) => {
      console.error("error:", error);
    });
}

// img要素を生成し、src属性にURLをセットする
function createImg(imgUrl) {
  let img = new Image();
  img.src = imgUrl;
  img.height = "50";
  return img;
}

// video要素を生成し、src属性にURLをセットする
function createVideo(videoUrl) {
  let video = document.createElement("video");
  // video.width = "320";
  video.height = "100";
  video.setAttribute("preload", "metadata");
  video.src = videoUrl;
  return video;
}

// テキストをサーバに送信
function sendTextToServer(type, content) {
  return new Promise((resolve, reject) => {
    const data = {
      amico_id: MY_AMICO_ID,
      message: { type: type, content: content },
    };
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    };

    fetch(SEND_TEXT_URL, param)
      .then((response) => response.json())
      .then((data) => {
        console.log("result:", data[0].message);
        data[0].result ? resolve(data[0].timestamp) : reject();
      })
      .catch((error) => {
        console.error("error:", error);
        reject(error);
      });
  });
}

// スタンプをサーバに送信
function sendStampToServer(type, content) {
  return new Promise((resolve, reject) => {
    const data = {
      amico_id: MY_AMICO_ID,
      message: { type: type, content: content },
    };
    const param = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    };

    fetch(SEND_STAMP_URL, param)
      .then((response) => response.json())
      .then((data) => {
        console.log("result:", data[0].message);
        data[0].result ? resolve() : reject();
      })
      .catch((error) => {
        console.error("error:", error);
        reject(error);
      });
  });
}

// ================================================== 拡大表示 ==================================================
// 画像・動画を拡大表示
function startEnlargedMedia(type, contentElem) {
  return new Promise((resolve, reject) => {
    switch (type) {
      case "image":
        enlargeImg(contentElem);
        break;

      case "video":
        enlargeVideo(contentElem);

        break;

      default:
        break;
    }

    const fullscreenElem = document.getElementById("enlargedMedia");
    fullscreenElem.addEventListener("click", function () {
      resolve();
    });
  });

  // 画像拡大表示
  function enlargeImg(img) {
    img.onload = function () {
      const largeImg = enlargeImg(img);
      addMediaToElem(largeImg);
      showEnlargedMedia();
    };

    // 画像を複製して拡大する
    function enlargeImg(img) {
      const largeImg = img.cloneNode();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      let imgWidth = largeImg.naturalWidth;
      let imgHeight = largeImg.naturalHeight;

      // アスペクト比を維持して画像を縮小
      // 画像幅を画面幅以下にし、画像高も合わせて縮小する
      let ratioWidth = windowWidth / imgWidth;
      if (ratioWidth < 1) {
        imgWidth = windowWidth;
        imgHeight = Math.floor(imgHeight * ratioWidth);
      }

      // 画像高を画面高以下にし、画像幅も合わせて縮小する
      let ratioHeight = windowHeight / imgHeight;
      if (ratioHeight < 1) {
        imgHeight = windowHeight;
        imgWidth = Math.floor(imgWidth * ratioHeight);
      }

      // 画像に幅・高さを適用
      largeImg.width = imgWidth;
      largeImg.height = imgHeight;

      largeImg.classList.add("large-media");
      return largeImg;
    }
  }

  // 動画拡大表示
  function enlargeVideo(video) {
    const largeVideo = copyVideo(video);
    addMediaToElem(largeVideo);
    showEnlargedMedia();
    startVideo();

    // 動画を複製して属性を変更する
    function copyVideo(video) {
      const largeVideo = video.cloneNode();
      largeVideo.setAttribute("loop", "loop");
      largeVideo.classList.add("large-media", "hide-elem");
      return largeVideo;
    }

    // 動画を全画面再生する
    function startVideo() {
      const enlargedMedia = parent.document.getElementById("enlargedMedia");
      const video = enlargedMedia.querySelector("video");
      video.addEventListener("loadedmetadata", () => {
        // アスペクト比を維持して動画を縮小
        const windowWidth = parent.window.innerWidth;
        const windowHeight = parent.window.innerHeight;
        let videoWidth = video.videoWidth;
        let videoHeight = video.videoHeight;

        // 動画幅を画面幅以下にし、動画高も合わせて縮小する
        let ratioWidth = windowWidth / videoWidth;
        if (ratioWidth < 1) {
          videoWidth = windowWidth;
          videoHeight = Math.floor(videoHeight * ratioWidth);
        }

        // 動画高を画面高以下にし、動画幅も合わせて縮小する
        let ratioHeight = windowHeight / videoHeight;
        if (ratioHeight < 1) {
          videoHeight = windowHeight;
          videoWidth = Math.floor(videoWidth * ratioHeight);
        }

        // 動画に幅・高さを適用
        video.width = videoWidth;
        video.height = videoHeight;

        video.classList.remove("hide-elem");
        video.play();
      });
    }
  }

  // ================================================== 拡大表示共通関数 ==================================================
  // 拡大表示用要素に追加する
  function addMediaToElem(media) {
    const enlargedMedia = document.getElementById("enlargedMedia");
    enlargedMedia.appendChild(media);
  }

  // メディア拡大表示画面を表示する;
  function showEnlargedMedia() {
    changeVisibility(true, "enlargedMedia");
  }
}

// 画像拡大表示用要素を隠す
function hideEnlargedMedia(elem) {
  changeVisibility(false, "enlargedMedia");
  elem.innerHTML = "";
}

// ================================================== 画面表示 ==================================================
// 要素の表示・非表示を切り替える
function changeVisibility(visibility, id) {
  const elem = document.getElementById(id);
  if (elem) {
    if (visibility) {
      elem.classList.remove("hide-elem");
      elem.classList.add("visible-elem");
    } else {
      elem.classList.remove("visible-elem");
      elem.classList.add("hide-elem");
    }
  }
}

// デバッグメッセージを表示する
function showDebugMsg(msg) {
  const elem = document.getElementById("debugMsg");
  elem.innerText = msg;
}
