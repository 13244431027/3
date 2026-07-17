let id = location.href.split("/").pop().split("?").shift();
console.log("宸茶幏鍙栧埌浣滃搧id:", id);
setInterval(() => fetch("https://community-web.ccw.site/creation_stats/view", {
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    body: `{"oid":"${id}"}`
}), 100)