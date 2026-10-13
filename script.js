"use strict";

// Dữ liệu khởi tạo
let items = [
  { id: 1, title: "Viết báo cáo HTML",     dueDate: "2026-10-20", priority: "Cao",        status: "pending" },
  { id: 2, title: "Ôn Flexbox",            dueDate: "2026-10-23", priority: "Trung bình", status: "pending" },
  { id: 3, title: "Làm bài DOM",           dueDate: "2026-10-19", priority: "Cao",        status: "done"    },
  { id: 4, title: "Đọc tài liệu CSS",      dueDate: "2026-10-25", priority: "Thấp",       status: "pending" },
  { id: 5, title: "Thiết kế trang cá nhân", dueDate: "2026-10-21", priority: "Trung bình", status: "done"    }
];

let nextId = 6;

// Lấy DOM
const taskForm      = document.getElementById("task-form");
const titleInput    = document.getElementById("task-title");
const dueInput      = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const searchInput   = document.getElementById("search-input");
const filterSelect  = document.getElementById("filter-status");
const taskList      = document.getElementById("task-list");
const emptyMsg      = document.getElementById("empty-msg");

// ===== HÀM FORMAT NGÀY KIỂU MỸ (mm/dd/yyyy) =====
function formatDateUS(isoDate) {
  if (!isoDate) return "Không có";
  const [y, m, d] = isoDate.split("-");
  return `${m}/${d}/${y}`;   // 👈 mm/dd/yyyy
}

// ===== C1: RENDER DANH SÁCH =====
function renderTasks() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filter  = filterSelect.value;

  // Lọc
  const filtered = items.filter(it => {
    const matchSearch = it.title.toLowerCase().includes(keyword);
    let matchFilter = true;
    if (filter === "pending") matchFilter = it.status === "pending";
    else if (filter === "done") matchFilter = it.status === "done";
    return matchSearch && matchFilter;
  });

  // Xóa cũ
  taskList.innerHTML = "";

  // Rỗng?
  if (filtered.length === 0) {
    emptyMsg.classList.remove("hidden");
  } else {
    emptyMsg.classList.add("hidden");
  }

  // Render
  filtered.forEach(task => {
    const priorityClass = task.priority.replace(/\s/g, ""); // "Trung bình" -> "Trungbình"
    const li = document.createElement("li");
    li.className = `task-item priority-${priorityClass} ${task.status === "done" ? "done" : ""}`;

    li.innerHTML = `
      <div class="task-info">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span>📅 Hạn: ${formatDateUS(task.dueDate)}</span>
          <span class="badge ${priorityClass}">${task.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-action btn-done" data-action="toggle" data-id="${task.id}">
          ${task.status === "done" ? "↺ Hoàn tác" : "✓ Xong"}
        </button>
        <button class="btn-action btn-delete" data-action="delete" data-id="${task.id}">
          ✕ Xóa
        </button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// ===== C2: THÊM CÔNG VIỆC =====
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title    = titleInput.value.trim();
  const dueDate  = dueInput.value;    // yyyy-mm-dd
  const priority = priorityInput.value;

  if (title === "") {
    alert("⚠️ Vui lòng nhập tên công việc!");
    titleInput.focus();
    return;
  }

  items.push({
    id: nextId++,
    title: title,
    dueDate: dueDate,
    priority: priority,
    status: "pending"
  });

  taskForm.reset();
  priorityInput.value = "Trung bình";
  renderTasks();
});

// ===== C3: TÌM KIẾM & LỌC =====
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

// ===== C4: CẬP NHẬT TRẠNG THÁI & XÓA (dùng event delegation) =====
taskList.addEventListener("click", function (e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const id     = Number(btn.dataset.id);
  const action = btn.dataset.action;

  if (action === "toggle") {
    const task = items.find(t => t.id === id);
    if (task) {
      task.status = task.status === "done" ? "pending" : "done";
      renderTasks();
    }
  } else if (action === "delete") {
    if (confirm("Bạn có chắc muốn xóa công việc này?")) {
      items = items.filter(t => t.id !== id);
      renderTasks();
    }
  }
});

// ===== CHẠY LẦN ĐẦU =====
renderTasks();