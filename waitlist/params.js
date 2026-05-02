(function () {
  var form = document.querySelector("form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  ["source_path", "feed_source", "episode_id", "attribution_token"].forEach(function (name) {
    var value = params.get(name);
    if (!value) return;

    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
  });
})();

