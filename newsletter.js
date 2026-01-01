document.addEventListener("DOMContentLoaded", function () {
  var attrForm = "data-newsletter";

  function showMessage(container, text, isError) {
    var box = container.querySelector("[data-newsletter-message]");
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("data-newsletter-message", "1");
      box.className = "mt-2 text-xs";
      container.appendChild(box);
    }
    box.textContent = text || "";
    if (!text) return;
    if (isError) {
      box.classList.remove("text-green-400");
      box.classList.add("text-red-400");
    } else {
      box.classList.remove("text-red-400");
      box.classList.add("text-green-400");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var wrapper = form.parentElement || form;
    var input = form.querySelector('input[type="email"]');
    if (!input) {
      return;
    }
    var value = input.value.trim();
    if (!value) {
      showMessage(wrapper, "Please enter your email address.", true);
      return;
    }
    showMessage(wrapper, "Subscribing...", false);
    fetch("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: value })
    })
      .then(function (res) {
        if (!res.ok) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.ok) {
          throw new Error("failed");
        }
        input.value = "";
        showMessage(wrapper, "You have been subscribed.", false);
      })
      .catch(function () {
        showMessage(wrapper, "Subscription failed. Please try again.", true);
      });
  }

  var explicitForms = document.querySelectorAll("form[" + attrForm + "]");
  explicitForms.forEach(function (form) {
    form.addEventListener("submit", handleSubmit);
  });

  if (!explicitForms.length) {
    var forms = document.querySelectorAll("form");
    forms.forEach(function (form) {
      if (form.getAttribute(attrForm) === "1") return;
      var emailInput = form.querySelector('input[type="email"]');
      var button = form.querySelector("button");
      if (!emailInput || !button) return;
      if (
        (button.textContent || "")
          .toLowerCase()
          .indexOf("subscribe") === -1
      ) {
        return;
      }
      form.setAttribute(attrForm, "1");
      form.addEventListener("submit", handleSubmit);
    });
  }
});

