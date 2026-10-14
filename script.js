// Quản lý chuyển động liếc mắt theo con trỏ chuột
const pupils = document.querySelectorAll('.pupil');

window.addEventListener('mousemove', (e) => {
  pupils.forEach(pupil => {
    // 1. Lấy tọa độ tâm của con mắt hiện tại trên khung hình
    const rect = pupil.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    // 2. Tính toán góc quay giữa vị trí chuột và tâm mắt
    const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
    
    // 3. Giới hạn bán kính liếc (Max tầm di chuyển bên trong lòng trắng)
    const maxMove = 28; // Tăng biên độ lên một chút để phù hợp mắt kích thước lớn hơn
    
    const moveX = Math.cos(angle) * maxMove;
    const moveY = Math.sin(angle) * maxMove;

    // 4. Cập nhật vị trí tịnh tiến liên tục theo tọa độ chuột
    pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
  });
});