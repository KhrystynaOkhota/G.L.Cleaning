jQuery(function ($) {
  document.querySelectorAll('.s-comparison .swiper-entry').forEach(entry => {
    const container = entry.querySelector('.swiper-container');
    const options = JSON.parse(container.getAttribute('data-options'));
    const swiper = new Swiper(container, { ...options, touchStartPreventDefault: false });

    const sliders = container.querySelectorAll('.comparison-block');

    sliders.forEach(slider => {
      const handle = slider.querySelector('.comparison-block__handle');
      const divider = slider.querySelector('.comparison-block__divider');
      const beforeImage = slider.querySelector('.comparison-block__image-wrap--before');
      const afterImage = slider.querySelector('.comparison-block__image-wrap--after');

      let isDragging = false;

      const initializeSlider = () => {
        handle.style.transition = "left 0.3s ease";
        divider.style.transition = "left 0.3s ease";
        handle.style.left = "50%";
        divider.style.left = "50%";
        beforeImage.style.clipPath = `inset(0 50% 0 0)`;
        afterImage.style.clipPath = `inset(0 0 0 50%)`;
      };

      const moveSlider = (clientX) => {
        const rect = slider.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        handle.style.left = `${percent}%`;
        divider.style.left = `${percent}%`;
        beforeImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`;
      };

      const startDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging = true;
        handle.style.transition = 'none';
        divider.style.transition = 'none';
        swiper.allowTouchMove = false;
      };

      const stopDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        isDragging = false;
        handle.style.transition = 'left 0.3s ease';
        divider.style.transition = 'left 0.3s ease';
        swiper.allowTouchMove = true;
      };

      handle.addEventListener('pointerdown', startDrag);
      divider.addEventListener('pointerdown', startDrag);

      window.addEventListener('pointermove', e => { if (isDragging) moveSlider(e.clientX); });
      window.addEventListener('pointerup', stopDrag);
      window.addEventListener('pointercancel', stopDrag);

      initializeSlider();
    });
  });
});