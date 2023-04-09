(() => {
  var saveFunction, timestampFunction, modules = {
      255: e => {
          function getType(e) {
              return getType = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
                  return typeof e
              } : function (e) {
                  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
              }, getType(e)
          }
          e.exports = function (e, fileType) {
              e.save = function (data) {
                  var fileName = "chatgpt",
                      mimeType = "text/plain";
                  "json" === fileType.toLowerCase() ? (fileName += ".json", mimeType = "text/json", "object" === getType(data) && (data = JSON.stringify(data, void 0, 4))) : "md" === fileType.toLowerCase() && (fileName += ".md");
                  var fileBlob = new Blob([data], {
                          type: mimeType
                      }),
                      linkElem = document.createElement("a");
                  linkElem.download = fileName, linkElem.href = window.URL.createObjectURL(fileBlob), linkElem.dataset.downloadurl = [mimeType, linkElem.download, linkElem.href].join(":");
                  var clickEvent = new MouseEvent("click", {
                      canBubble: !0,
                      cancelable: !1,
                      view: window,
                      detail: 0,
                      screenX: 0,
                      screenY: 0,
                      clientX: 0,
                      clientY: 0,
                      ctrlKey: !1,
                      altKey: !1,
                      shiftKey: !1,
                      metaKey: !1,
                      button: 0,
                      relatedTarget: null
                  });
                  linkElem.dispatchEvent(clickEvent)
              }
          }
      },
      380: e => {
          e.exports = function () {
              return new Date(new Date(new Date(new Date).toISOString()).getTime() - 6e4 * (new Date).getTimezoneOffset()).toISOString().slice(0, 19).replace("T", " ")
          }
      },
      moduleStorage: {}
  };

  function requireModule(e) {
      var t = modules.moduleStorage[e];
      if (void 0 !== t) return t.exports;
      var r = modules.moduleStorage[e] = {
          exports: {}
      };
      return modules[e](r, r.exports, requireModule), r.exports
  }
  saveFunction = requireModule(255);
  timestampFunction = requireModule(380);

  (() => {
      var outputJSON = {
          meta: {
              timestamp: timestampFunction()
          },
          chats: []
      };

      var chatElements = document.querySelectorAll("[class*='min-h-[20px]']");

      for (var i = 0; i < chatElements.length; i++) {
          var chatElement = chatElements[i],
              chatObject = {
                  index: i
              },
              chatData = [],
              node = chatElement.firstChild;

          if (node) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                  var childNodes = node.childNodes;
                  node.className.includes("request-") && (chatObject.type = "response");

                  for (let j = 0; j < childNodes.length; j++) {
                      let child = childNodes[j];

                      if (child.nodeType === Node.ELEMENT_NODE) {
                          let tagName = child.tagName,
                              textContent = child.textContent;

                          switch (tagName) {
                              case "P":
                                  chatData.push({
                                      type: "p",
                                      data: textContent
                                  });
                                  break;
                              case "OL":
                              case "UL":
                                  let listItems = [];

                                  child.childNodes.forEach((listItem, idx) => {
                                      listItem.nodeType === Node.ELEMENT_NODE && "LI" === listItem.tagName && listItems.push({
                                          type: "li",
                                          data: listItem.textContent
                                      });
                                  });

                                  "OL" === tagName && chatData.push({
                                      type: "ol",
                                      data: listItems
                                  });

                                  "UL" === tagName && chatData.push({
                                      type: "ul",
                                      data: listItems
                                  });
                                  break;
                              case "PRE":
                                  let codeParts = textContent.split("Copy code"),
                                      language = codeParts[0].trim(),
                                      code = codeParts[1].trim();

                                  chatData.push({
                                      type: "pre",
                                      language: language,
                                      data: code
                                  });
                                  break;
                              case "TABLE":
                                  let tableData = [];

                                  child.childNodes.forEach((tablePart) => {
                                      if (tablePart.nodeType === Node.ELEMENT_NODE && ["THEAD", "TBODY"].includes(tablePart.tagName)) {
                                          let rows = [];

                                          tablePart.childNodes.forEach((row) => {
                                              if (row.nodeType === Node.ELEMENT_NODE && "TR" === row.tagName) {
                                                  let cells = [];

                                                  row.childNodes.forEach((cell) => {
                                                      if (cell.nodeType === Node.ELEMENT_NODE && ["TD", "TH"].includes(cell.tagName)) {
                                                          cells.push({
                                                              type: cell.tagName.toLowerCase(),
                                                              data: cell.textContent
                                                          });
                                                      }
                                                  });

                                                  rows.push({
                                                      type: "tr",
                                                      data: cells
                                                  });
                                              }
                                          });

                                          tableData.push({
                                              type: tablePart.tagName.toLowerCase(),
                                              data: rows
                                          });
                                      }
                                  });

                                  chatData.push({
                                      type: "table",
                                      data: tableData
                                  });
                                  break;
                          }
                      }
                  }
              }
              node.nodeType === Node.TEXT_NODE && (chatObject.type = "prompt", chatData.push(node.textContent));
              chatObject.message = chatData;
              outputJSON.chats.push(chatObject);
          }
      }

      saveFunction(console, "json");
      console.save(outputJSON);
  })();
})();
