// Get that hamburger menu cookin' //

document.addEventListener("DOMContentLoaded", function() {
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function($el) {
      $el.addEventListener("click", function() {
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);
        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }

  var originalTitle = document.title;

  function normalizeInviteCode(hash) {
    if (!hash) return "";
    var cleaned = hash.replace(/^#\/?/, "").trim();
    try {
      return decodeURIComponent(cleaned);
    } catch (e) {
      return cleaned;
    }
  }

  function formatGuestInfo(nome, qtd) {
    var qty = Number(qtd);
    var label = qty === 1 ? "pessoa" : "pessoas";
    if (!nome) return "";
    if (Number.isFinite(qty) && qty > 0) return "Olá, " + nome + "! Este convite é válido para " + qty + " " + label + ".";
    return "Olá, " + nome + "!";
  }

  function setGuestInfoText(text) {
    var el = document.getElementById("guestInfo");
    if (!el) return;
    if (!text) {
      el.textContent = "";
      el.classList.add("is-hidden");
      return;
    }
    el.textContent = text;
    el.classList.remove("is-hidden");
  }

  function setGuestInline(nome, qtd) {
    var nameEl = document.getElementById("guestNameInline");
    if (nameEl) nameEl.textContent = nome || "você";

    var qtyLineEl = document.getElementById("guestQtyLine");
    var qtyEl = document.getElementById("guestQtyInline");
    var qty = Number(qtd);
    var isSingle = Number.isFinite(qty) && qty === 1;

    var introPluralEl = document.getElementById("guestIntroPlural");
    var introSingleEl = document.getElementById("guestIntroSingular");
    var outroPluralEl = document.getElementById("guestOutroPlural");
    var outroSingleEl = document.getElementById("guestOutroSingular");
    var qtyPluralEl = document.getElementById("guestQtyPlural");
    var qtySingleEl = document.getElementById("guestQtySingular");

    if (introPluralEl) introPluralEl.classList.toggle("is-hidden", isSingle);
    if (introSingleEl) introSingleEl.classList.toggle("is-hidden", !isSingle);
    if (outroPluralEl) outroPluralEl.classList.toggle("is-hidden", isSingle);
    if (outroSingleEl) outroSingleEl.classList.toggle("is-hidden", !isSingle);

    if (qtyPluralEl) qtyPluralEl.classList.toggle("is-hidden", isSingle);
    if (qtySingleEl) qtySingleEl.classList.toggle("is-hidden", !isSingle);

    if (qtyLineEl && Number.isFinite(qty) && qty > 0) {
      if (qtyEl) qtyEl.textContent = String(qty);
      qtyLineEl.classList.remove("is-hidden");
    } else if (qtyLineEl) {
      qtyLineEl.classList.add("is-hidden");
    }
  }

  function showInviteError(title, message) {
    var modal = document.getElementById("inviteErrorModal");
    var titleEl = document.getElementById("inviteErrorTitle");
    var messageEl = document.getElementById("inviteErrorMessage");
    if (titleEl) titleEl.textContent = title || "Convite não encontrado";
    if (messageEl) messageEl.textContent = message || "Confira o link enviado pelos noivos.";
    if (modal) modal.classList.add("is-active");
    document.documentElement.classList.add("is-clipped");
    document.title = (title ? "404 - " + title : "404 - Convite não encontrado");
  }

  function hideInviteError() {
    var modal = document.getElementById("inviteErrorModal");
    if (modal) modal.classList.remove("is-active");
    document.documentElement.classList.remove("is-clipped");
    document.title = originalTitle;
  }

  async function loadInviteFromHash() {
    var code = normalizeInviteCode(window.location.hash);
    if (!code) {
      setGuestInfoText("");
      setGuestInline("", 0);
      showInviteError("Convite não encontrado", "Use o link completo que os noivos enviaram.");
      return;
    }

    try {
      var response = await fetch("invites/" + encodeURIComponent(code) + ".json", { cache: "no-store" });
      if (!response.ok) {
        setGuestInfoText("");
        setGuestInline("", 0);
        showInviteError("Convite não encontrado", "Confira o link e tente novamente.");
        return;
      }
      var data = await response.json();
      if (data && data.exp) {
        var now = Math.floor(Date.now() / 1000);
        if (now > Number(data.exp)) {
          setGuestInfoText("");
          setGuestInline("", 0);
          showInviteError("Convite expirado", "Este convite não está mais disponível.");
          return;
        }
      }
      hideInviteError();
      var nome = data && data.nome ? String(data.nome) : "";
      setGuestInline(nome, data && data.qtd);
      setGuestInfoText(formatGuestInfo(nome, data && data.qtd));
    } catch (e) {
      setGuestInfoText("");
      setGuestInline("", 0);
      showInviteError("Convite não encontrado", "Confira o link e tente novamente.");
    }
  }

  loadInviteFromHash();
  window.addEventListener("hashchange", loadInviteFromHash);
});

// Smooth Anchor Scrolling
$(document).on("click", 'a[href^="#"]', function(event) {
  event.preventDefault();
  $("html, body").animate(
    {
      scrollTop: $($.attr(this, "href")).offset().top
    },
    500
  );
});

// When the user scrolls down 20px from the top of the document, show the scroll up button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  var toTopEl = document.getElementById("toTop");
  if (toTopEl) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      toTopEl.style.display = "block";
    } else {
      toTopEl.style.display = "none";
    }
  }

  var hint = document.getElementById("scrollHint");
  if (!hint) return;
  if (document.documentElement.classList.contains("is-clipped")) {
    hint.classList.remove("is-visible");
    return;
  }

  var presentesSection = document.getElementById("presentes");
  if (presentesSection) {
    var rect = presentesSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 10) {
      hint.classList.remove("is-visible");
      return;
    }
  }

  var docEl = document.documentElement;
  var scrollTop = docEl.scrollTop || document.body.scrollTop || 0;
  var scrollMax = (docEl.scrollHeight || document.body.scrollHeight) - docEl.clientHeight;
  if (scrollMax <= 60) {
    hint.classList.remove("is-visible");
    return;
  }
  if (scrollTop >= scrollMax - 40) {
    hint.classList.remove("is-visible");
  } else {
    hint.classList.add("is-visible");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  scrollFunction();
});

window.addEventListener("load", function () {
  scrollFunction();
});

// Preloader
$(document).ready(function($) {
  $(".preloader-wrapper").fadeOut();
  $("body").removeClass("preloader-site");
});
$(window).load(function() {
  var Body = $("body");
  Body.addClass("preloader-site");
});
