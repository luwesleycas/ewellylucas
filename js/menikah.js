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
    if (qtyLineEl && qtyEl && Number.isFinite(qty) && qty > 0) {
      qtyEl.textContent = String(qty);
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
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("toTop").style.display = "block";
  } else {
    document.getElementById("toTop").style.display = "none";
  }
}

// Preloader
$(document).ready(function($) {
  $(".preloader-wrapper").fadeOut();
  $("body").removeClass("preloader-site");
});
$(window).load(function() {
  var Body = $("body");
  Body.addClass("preloader-site");
});
