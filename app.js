let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

const time_line = new TimelineMax();

// parameter 1 欲控制對象
// parameter 2 動畫執行時間
// parameter 3 是控制對象的狀態調整
// parameter 4 是控制對象的動畫結束後的狀態
// parameter 5 提早多少開始跑 e.g.: -=1.2 (提早1.2秒開始跑)
time_line
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  .fromTo(
    slider,
    1,
    { x: "-100%" },
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500);

// 讓整個網站Enter鍵無法使用
window.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
});

// 防止form內的button交出表單
let allInputs = document.querySelector(".all-inputs");
allInputs.addEventListener("click", (e) => {
  if (e.target.getAttribute("class") === "trash-button") {
    e.preventDefault();
  }
});

// 選擇select內的option，改變成相對應的顏色
let allSelect = document.querySelectorAll("select");
allSelect.forEach((el) => {
  el.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target); // 將 e.target(select)傳入changeColor
  });
});

// 改變credits，更新GPA
let credits = document.querySelectorAll(".class-credits");
credits.forEach((credit) => {
  credit.addEventListener("change", () => {
    setGPA();
  });
});

// 改變select，則更新顏色
function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style.backgroundColor = "lightgreen";
    target.style.color = "black";
  } else if (
    target.value == "B+" ||
    target.value == "B" ||
    target.value == "B-"
  ) {
    target.style.backgroundColor = "yellow";
    target.style.color = "black";
  } else if (
    target.value == "C+" ||
    target.value == "C" ||
    target.value == "C-"
  ) {
    target.style.backgroundColor = "orange";
    target.style.color = "black";
  } else if (
    target.value == "D+" ||
    target.value == "D" ||
    target.value == "D-"
  ) {
    target.style.backgroundColor = "red";
    target.style.color = "black";
  } else if (target.value == "F") {
    target.style.backgroundColor = "grey";
    target.style.color = "white";
  } else {
    target.style.backgroundColor = "white";
  }
}

// 取得grade對應的分數
function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

// 取得GPA的計算節果
function setGPA(targetValue) {
  let formLength = document.querySelectorAll("form").length;
  let credits = document.querySelectorAll(".class-credits");
  let selects = document.querySelectorAll("select");
  let resultGPA = document.querySelector("#result-gpa");
  let sum = 0; // GPA計算用分子
  let creditSum = 0; // GPA計算用分母

  for (let i = 0; i < credits.length; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      creditSum += credits[i].valueAsNumber;
    }
  }

  for (let i = 0; i < formLength; i++) {
    if (!isNaN(credits[i].valueAsNumber)) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }

  let result;

  if (creditSum === 0) {
    result = (0).toFixed(2);
  } else {
    result = (sum / creditSum).toFixed(2);
  }

  resultGPA.textContent = result;
}

// 增加form
let addButton = document.querySelector(".plus-btn");
addButton.addEventListener("click", () => {
  let newForm = document.createElement("form");
  newForm.innerHTML = ` <div class="grader">
  <input type="text" placeholder="class category" class="class-type" list="opt">
  <input type="text" placeholder="class number" class="class-number">
  <input type="number" placeholder="credit" min="0" max="6" class="class-credits">
  <select name="select" class="select">
    <option value=""></option>
    <option value="A">A</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B">B</option>
    <option value="B-">B-</option>
    <option value="C+">C+</option>
    <option value="C">C</option>
    <option value="C-">C-</option>
    <option value="D+">D+</option>
    <option value="D">D</option>
    <option value="D-">D-</option>
    <option value="F">F</option>
  </select>
  <button class="trash-button">
    <i class="fas fa-trash"></i>
  </button>
  </div>`;

  let credit = newForm.children[0].children[2];
  credit.addEventListener("change", (e) => {
    setGPA();
  });

  let select = newForm.children[0].children[3];
  select.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target); // 將 e.target(select)傳入changeColor
  });

  let trash = newForm.children[0].children[4];
  trash.addEventListener("click", (e) => {
    newForm.style.animation = "scaleDown 0.5s ease forwards";
    newForm.addEventListener("animationend", (e) => {
      e.target.remove();
      setGPA();
    });
  });

  newForm.style.animation = "scaleUp 0.5s ease forwards";

  document.querySelector(".all-inputs").appendChild(newForm);
});

// 刪除鈕製作
let allTrash = document.querySelectorAll(".trash-button");
allTrash.forEach((trash) => {
  let form = trash.parentElement.parentElement;

  // 製作刪除前的縮小動畫
  trash.addEventListener("click", (e) => {
    form.classList.add("remove");
  });

  // 將整個element刪除
  form.addEventListener("transitionend", () => {
    form.remove();
    setGPA();
  });
});

// 排序演算法
let desBtn = document.querySelector(".sort-descending");
let ascBtn = document.querySelector(".sort-ascending");
desBtn.addEventListener("click", () => {
  handleSorting("descending");
});
ascBtn.addEventListener("click", () => {
  handleSorting("ascending");
});

// 處理排序
function handleSorting(direction) {
  let grader = document.querySelectorAll(".grader");
  let objectArray = [];

  grader.forEach((el) => {
    let class_name = el.children[0].value; // class category
    let class_number = el.children[1].value; // class number
    let class_credit = el.children[2].value; // class credit
    let class_grade = el.children[3].value; // class grade
    let class_grade_number = convertor(el.children[3].value); // class grade covert 後的 number

    if (
      !(
        class_name == "" &&
        class_number == "" &&
        class_credit == "" &&
        class_grade == ""
      )
    ) {
      let class_object = {
        class_name,
        class_number,
        class_credit,
        class_grade,
        class_grade_number,
      };

      objectArray.push(class_object);
    }
  });

  objectArray = mergeSort(objectArray);
  if (direction == "descending") {
    objectArray.reverse();
  }

  grader.forEach((el, ind) => {
    if (ind < objectArray.length) {
      el.children[0].value = objectArray[ind].class_name;
      el.children[1].value = objectArray[ind].class_number;
      el.children[2].value = objectArray[ind].class_credit;
      el.children[3].value = objectArray[ind].class_grade;
      changeColor(el.children[3]) // 更新成新的 grade 的背景顏色 
    } else {
      el.children[0].value = "";
      el.children[1].value = "";
      el.children[2].value = "";
      el.children[3].value = "";
      el.children[3].style.backgroundColor = "white";
    }
  });
  console.log(objectArray);
}

// 將兩個array比較後合併
function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number < a2[j].class_grade_number) {
      result.push(a1[i]);
      i++;
    } else {
      result.push(a2[j]);
      j++;
    }
  }

  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }

  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }

  return result;
}

// merge sort，將一個 array 拆分成兩個 array，並且比較後合併(merge)
function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  } else if (arr.length == 1) {
    return arr;
  }

  let middle = Math.floor(arr.length / 2);
  let left = arr.slice(0, middle);
  let right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}
