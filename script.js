// ============================================
// ГЛАВНЫЙ СКРИПТ ВАЛЕНТИНКИ
// ============================================

// Ждём полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
  initValentine();
});

function initValentine() {
  // Запускаем анимацию сердечек
  startHearts();
  
  // Показываем конверт через заданное время
  setTimeout(() => {
    showEnvelope();
  }, CONFIG.timing.heartsBeforeEnvelope);
}

// ============================================
// АНИМАЦИЯ ЛЕТАЮЩИХ СЕРДЕЧЕК
// ============================================

function startHearts() {
  const container = document.getElementById('hearts-container');
  const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝'];
  
  // Создаём сердечки с интервалом
  const heartInterval = setInterval(() => {
    createHeart(container, heartEmojis);
  }, CONFIG.timing.heartInterval);
  
  // Продолжаем создавать сердечки даже после открытия конверта
  // но реже, для фона
  setTimeout(() => {
    clearInterval(heartInterval);
    setInterval(() => {
      createHeart(container, heartEmojis);
    }, CONFIG.timing.heartInterval * 3);
  }, CONFIG.timing.heartsBeforeEnvelope + 2000);
}

function createHeart(container, emojis) {
  const heart = document.createElement('div');
  heart.className = 'heart';
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  
  // Случайная позиция по X
  const randomX = Math.random() * window.innerWidth;
  heart.style.left = randomX + 'px';
  heart.style.bottom = '60px';
  
  // Случайная задержка появления
  heart.style.animationDelay = (Math.random() * 0.5) + 's';
  
  // Случайный размер
  const randomSize = 20 + Math.random() * 20;
  heart.style.fontSize = randomSize + 'px';
  
  container.appendChild(heart);
  
  // Удаляем сердечко после анимации
  setTimeout(() => {
    heart.remove();
  }, 6500);
}

// ============================================
// ПОКАЗ И ВЗАИМОДЕЙСТВИЕ С КОНВЕРТОМ
// ============================================

function showEnvelope() {
  const envelope = document.getElementById('envelope');
  envelope.classList.remove('hidden');
  
  // Добавляем тряску
  setTimeout(() => {
    envelope.classList.add('shake');
  }, 500);
  
  // Обработчик клика на конверт
  envelope.addEventListener('click', openEnvelope);
}

function openEnvelope() {
  const envelope = document.getElementById('envelope');
  const openedEnvelope = document.getElementById('opened-envelope');
  
  // Скрываем закрытый конверт
  envelope.classList.add('hidden');
  envelope.classList.remove('shake');
  
  // Показываем открытый конверт
  setTimeout(() => {
    openedEnvelope.classList.remove('hidden');
    openedEnvelope.classList.add('visible');
    
    // Загружаем фото
    setTimeout(() => {
      loadPhotos();
    }, 800);
  }, 100);
}

// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ ФОТОГРАФИЙ
// ============================================

function loadPhotos() {
  const photosContainer = document.getElementById('photos-container');
  
  CONFIG.photos.forEach((photo, index) => {
    setTimeout(() => {
      const polaroid = createPolaroid(photo);
      photosContainer.appendChild(polaroid);
    }, index * CONFIG.timing.photoDelay);
  });
  
  // После всех фото показываем текст
  const totalDelay = CONFIG.photos.length * CONFIG.timing.photoDelay + 500;
  setTimeout(() => {
    showTextBlocks();
  }, totalDelay);
}

function createPolaroid(photo) {
  const polaroid = document.createElement('div');
  polaroid.className = 'polaroid';
  
  const img = document.createElement('img');
  img.className = 'polaroid-image';
  img.src = photo.url;
  img.alt = photo.caption;
  img.loading = 'lazy'; // Ленивая загрузка для оптимизации
  
  const caption = document.createElement('div');
  caption.className = 'polaroid-caption';
  caption.textContent = photo.caption;
  
  polaroid.appendChild(img);
  polaroid.appendChild(caption);
  
  return polaroid;
}

// ============================================
// ТЕКСТОВЫЕ БЛОКИ
// ============================================

let currentTextIndex = 0;

function showTextBlocks() {
  const textContainer = document.getElementById('text-container');
  textContainer.classList.remove('hidden');
  textContainer.classList.add('visible');
  
  // Показываем первый блок
  showTextBlock(0);
}

function showTextBlock(index) {
  if (index >= CONFIG.textBlocks.length) return;
  
  const textContainer = document.getElementById('text-container');
  const blockData = CONFIG.textBlocks[index];
  
  // Очищаем предыдущий контент
  textContainer.innerHTML = '';
  
  // Создаём новый блок
  const textBlock = document.createElement('div');
  textBlock.className = 'text-block';
  if (blockData.isLast) {
    textBlock.classList.add('last');
  }
  textBlock.textContent = blockData.text;
  
  textContainer.appendChild(textBlock);
  
  // Если это не последний блок, добавляем обработчик клика
  if (!blockData.isLast) {
    textBlock.addEventListener('click', () => {
      currentTextIndex++;
      showTextBlock(currentTextIndex);
    });
  }
}

// ============================================
// ОБРАБОТКА ОШИБОК ЗАГРУЗКИ ИЗОБРАЖЕНИЙ
// ============================================

// Обрабатываем ошибки загрузки изображений
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.warn('Не удалось загрузить изображение:', e.target.src);
    // Можно показать placeholder
    e.target.style.background = 'linear-gradient(135deg, #ffc0d3 0%, #ffb3c6 100%)';
    e.target.alt = '💕';
  }
}, true);

// ============================================
// ОПТИМИЗАЦИЯ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
// ============================================

// Останавливаем анимации когда вкладка неактивна
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Приостанавливаем CSS анимации
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});

// Debounce для resize событий
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Можно добавить логику для пересчёта позиций
    console.log('Window resized');
  }, 250);
});
