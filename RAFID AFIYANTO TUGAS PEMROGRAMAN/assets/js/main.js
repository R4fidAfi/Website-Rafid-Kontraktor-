const siteConfig = {
  // Ganti dengan nomor WhatsApp bisnis yang aktif sebelum website dipublikasikan.
  whatsappNumber: "6285932869195",
  defaultMessage: "Halo Rafid Kontraktor, saya ingin konsultasi proyek rumah saya."
};

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);

const applyWhatsAppLinks = () => {
  document.querySelectorAll("[data-wa-link]").forEach((link) => {
    const message = link.dataset.waMessage || siteConfig.defaultMessage;
    link.href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
};

const setupMobileNav = () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-main-nav]");

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener("click", () => {
    menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(menu.classList.contains("is-open")));
  });

  document.querySelectorAll(".nav-item--has-dropdown > .nav-link").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      if (window.innerWidth > 980) {
        return;
      }

      event.preventDefault();
      trigger.parentElement.classList.toggle("is-open");
    });
  });
};

const highlightCurrentPage = () => {
  const page = document.body.dataset.page;
  if (!page) {
    return;
  }

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page || link.dataset.navParent === page) {
      link.classList.add("is-active");
    }
  });
};

const setupReveal = () => {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
};

const setupLeadForms = () => {
  document.querySelectorAll("[data-lead-form]").forEach((form) => {
    const feedback = form.querySelector(".form-feedback");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();

      if (feedback) {
        feedback.classList.add("is-visible");
        feedback.textContent =
          "Terima kasih. Permintaan konsultasi sudah dicatat. Silakan lanjutkan chat WhatsApp agar tim kami bisa merespons lebih cepat.";
      }
    });
  });
};

const setupGalleryFilter = () => {
  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-gallery-item]");

  if (!chips.length || !cards.length) {
    return;
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const category = chip.dataset.filter;

      chips.forEach((button) => button.classList.remove("is-active"));
      chip.classList.add("is-active");

      cards.forEach((card) => {
        const matches = category === "all" || card.dataset.galleryItem === category;
        card.classList.toggle("is-hidden", !matches);
      });
    });
  });
};

const setupEstimateForm = () => {
  const form = document.querySelector("[data-estimate-form]");
  const result = document.querySelector("[data-estimate-result]");

  if (!form || !result) {
    return;
  }

  const rates = {
    bangun: 4500000,
    desain: 175000,
    renovasi: 2800000,
    interior: 1500000,
    lengkap: 6000000
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const service = form.querySelector('[name="service"]').value;
    const area = Number(form.querySelector('[name="area"]').value);
    const quality = form.querySelector('[name="quality"]').value;

    const qualityFactor = {
      standar: 1,
      menengah: 1.16,
      premium: 1.32
    };

    const baseRate = rates[service] || rates.bangun;
    const estimate = area * baseRate * (qualityFactor[quality] || 1);
    const low = estimate * 0.92;
    const high = estimate * 1.08;

    result.classList.add("is-visible");
    result.innerHTML = `
      <strong>${formatRupiah(low)} - ${formatRupiah(high)}</strong>
      <span>Estimasi awal untuk layanan ${
        form.querySelector('[name="service"] option:checked').textContent
      } dengan luasan ${area} m2 dan kualitas ${quality}. Nilai final akan mengikuti gambar kerja, struktur, spesifikasi material, dan kondisi lapangan.</span>
    `;
  });
};

const setupYear = () => {
  document.querySelectorAll("[data-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  applyWhatsAppLinks();
  setupMobileNav();
  highlightCurrentPage();
  setupReveal();
  setupLeadForms();
  setupGalleryFilter();
  setupEstimateForm();
  setupYear();
});
