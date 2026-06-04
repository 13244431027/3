plugin.id = "patch-plugin-list-scroll";
plugin.name = "补丁：插件列表滚动条";
plugin.version = "1.0.0";

plugin.style = `
.patch-pl-scroll{
  max-height: 320px !important;
  overflow-y: auto !important;
}
.patch-pl-scroll::-webkit-scrollbar{
  width: 8px;
}
.patch-pl-scroll::-webkit-scrollbar-thumb{
  background: rgba(255,255,255,0.25);
  border-radius: 4px;
}
.patch-pl-scroll::-webkit-scrollbar-track{
  background: transparent;
}
`;

plugin.init = (context) => {
  plugin._ctx = context;
  applyPatch(context);
};

plugin.onHook = (hook) => {
  const ctx = plugin._ctx;
  if (!ctx) return;
  if (hook === "ui:ready" || hook === "mode:switch") {
    applyPatch(ctx);
  }
};

function applyPatch(ctx) {
  const list = ctx.ui && ctx.ui.pluginsList;
  if (!list) return;
  if (!list.classList.contains("patch-pl-scroll")) {
    list.classList.add("patch-pl-scroll");
  }
}
