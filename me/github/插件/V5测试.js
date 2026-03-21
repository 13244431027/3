plugin.id = "test.plugin.full";
plugin.name = "测试插件完整版";
plugin.version = "1.0.0";

plugin.API = [
  "string:a",
  "count:b",
  "silder(1-100):c",
  "choose(1,2,3):d"
];

plugin.init = function(context) {
  const { pluginAPI } = context;

  pluginAPI.setStatus("测试插件完整版已加载");

  plugin._btn = pluginAPI.addTabButton("测试按钮", function() {
    const modal = pluginAPI.createModal("测试插件窗口");

    const box = document.createElement("div");
    box.style.display = "flex";
    box.style.flexDirection = "column";
    box.style.gap = "8px";

    const vals = plugin.getSettings();

    const info = document.createElement("div");
    info.style.whiteSpace = "pre-wrap";
    info.style.fontSize = "12px";
    info.textContent =
      "当前参数：\n" +
      "a = " + vals.a + "\n" +
      "b = " + vals.b + "\n" +
      "c = " + vals.c + "\n" +
      "d = " + vals.d;

    const btn1 = pluginAPI.createButton("显示参数", function() {
      const v = plugin.getSettings();
      pluginAPI.alert(
        "参数信息：\n" +
        "a = " + v.a + "\n" +
        "b = " + v.b + "\n" +
        "c = " + v.c + "\n" +
        "d = " + v.d
      );
    });

    const btn2 = pluginAPI.createButton("修改参数", function() {
      plugin.setSetting("a", "hello");
      plugin.setSetting("b", Number(plugin.getSetting("b", 0)) + 1);
      plugin.setSetting("c", 66);
      plugin.setSetting("d", "2");
      info.textContent =
        "当前参数：\n" +
        "a = " + plugin.getSetting("a") + "\n" +
        "b = " + plugin.getSetting("b") + "\n" +
        "c = " + plugin.getSetting("c") + "\n" +
        "d = " + plugin.getSetting("d");
    });

    const btn3 = pluginAPI.createButton("触发测试Hook", function() {
      pluginAPI.plugins.trigger("test:manual", {
        from: plugin.id,
        time: Date.now()
      });
    });

    box.appendChild(info);
    box.appendChild(btn1);
    box.appendChild(btn2);
    box.appendChild(btn3);

    modal.body.appendChild(box);
  });
};

plugin.onHook = function(hookName, data, context) {
  const { pluginAPI } = context;

  if (hookName === "plugin:test") {
    pluginAPI.alert("收到 plugin:test");
  }

  if (hookName === "test:manual") {
    pluginAPI.alert("收到自定义 Hook: test:manual");
  }
};

plugin.onSettingsChange = function(key, value, values, context) {
  const { pluginAPI } = context;
  pluginAPI.setStatus("设置已更新: " + key + " = " + value);
};
