const header = document.getElementById("header").getHTML().toString();
const footer = document.getElementById("footer").getHTML().toString();
if (!localStorage.getItem("data")) {
  localStorage.setItem("data", "{}");
}

function generate_row(name) {
  return document
    .getElementById("base-class")
    .outerHTML.replaceAll("base-class", name);
}

function timeToMinutes(time) {
  const match = /^(\d+):([0-5]\d)$/.exec(time);

  if (!match) return 0;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  return hours * 60 + minutes;
}
function minutesToTime(totalMinutes) {
  if (isNaN(totalMinutes) || totalMinutes < 0) return "0:00";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

// Books = { math: { test: [], time: [] }, physics: { test: [], time: [] } }
function getStoredBooks() {
  return JSON.parse(localStorage.getItem("data"));
}
function create_row(bookname) {
  insert_row(bookname);
  // Initialize inputs to 0
  // book_element = document.getElementById(bookname);
  // book_element_tests = book_element.getElementsByClassName("test");
  // for (let i = 0; i < 7; i++) {
  //   book_element_tests[i].getElementsByTagName("input")[0].value = 0;
  // }
  // book_element_times = book_element.getElementsByClassName("time");
  // for (let i = 0; i < 7; i++) {
  //   book_element_times[i].getElementsByTagName("input")[0].value =
  //     minutesToTime(0);
  // }
  // book_element_darsad = book_element.getElementsByClassName("test-darsad");
  // for (let i = 0; i < 7; i++) {
  //   nazade = book_element_darsad[i].getElementsByTagName("input")[1];
  //   ghalat = book_element_darsad[i].getElementsByTagName("input")[2];
  //   nazade.value = 0;
  //   ghalat.value = 0;
  // }
  // save to localStorage
  const books = getStoredBooks();
  books[bookname] = {
    test: Array(7).fill(0),
    time: Array(7).fill(0),
    darsad: Array(7).fill([0, 0]),
    desc: Array(7).fill(""),
  };
  localStorage.setItem("data", JSON.stringify(books));
}
function insert_row(bookname) {
  book_content = getStoredBooks()[bookname];
  // Append a new row to the table
  const table = document.getElementById("maintable");
  const temp = document.createElement("tbody");
  temp.innerHTML = generate_row(bookname);
  const row = temp.firstElementChild;
  const footer = document.getElementById("day-sum");
  footer.parentNode.insertBefore(row, footer);
}
// load each row in the beginning
function load_row(bookname, first) {
  insert_row(bookname);
  // Initialize inputs to 0
  book_element = document.getElementById(bookname);
  book_element_tests = book_element.getElementsByClassName("test");
  for (let i = 0; i < 7; i++) {
    book_element_tests[i].getElementsByTagName("input")[0].value =
      book_content.test[i];
  }
  book_element_times = book_element.getElementsByClassName("time");
  for (let i = 0; i < 7; i++) {
    book_element_times[i].getElementsByTagName("input")[0].value =
      minutesToTime(book_content.time[i]);
  }

  book_element_desc = book_element.getElementsByClassName("desc");
  for (let i = 0; i < 7; i++) {
    book_element_desc[i].getElementsByTagName("textarea")[0].value =
      book_content.desc[i];
  }

  book_element_darsad = book_element.getElementsByClassName("test-darsad");
  for (let i = 0; i < 7; i++) {
    nazade = book_element_darsad[i].getElementsByTagName("input")[1];
    ghalat = book_element_darsad[i].getElementsByTagName("input")[2];
    nazade.value = book_content.darsad[i][0];
    ghalat.value = book_content.darsad[i][1];
  }
  update_book_time_sum(bookname);
  update_book_test_sum(bookname);
  update_book_darsad(bookname);
}
// store new test value when chaned
function store_new_test_value(bookname, dayindex, newvalue) {
  books = getStoredBooks();
  books[bookname].test[dayindex] = Number(newvalue);
  localStorage.setItem("data", JSON.stringify(books));
}

function store_new_desc_value(bookname, dayindex, newvalue) {
  books = getStoredBooks();
  books[bookname].desc[dayindex] = newvalue;
  localStorage.setItem("data", JSON.stringify(books));
}

// store new test darsad when chaned
function store_new_darsad_value_nazade(bookname, dayindex, nazade_value) {
  books = getStoredBooks();
  books[bookname].darsad[dayindex][0] = nazade_value;
  localStorage.setItem("data", JSON.stringify(books));
}
function store_new_darsad_value_ghalat(bookname, dayindex, ghalat_value) {
  books = getStoredBooks();
  books[bookname].darsad[dayindex][1] = ghalat_value;
  localStorage.setItem("data", JSON.stringify(books));
}
// store new time value when chaned
function store_new_time_value(bookname, dayindex, newvalue) {
  books = getStoredBooks();
  books[bookname].time[dayindex] = Number(timeToMinutes(newvalue));
  localStorage.setItem("data", JSON.stringify(books));
}
function update_book_darsad(bookname) {
  books = getStoredBooks();
  book_darsad_content = books[bookname].darsad;
  book_element = document.getElementById(bookname);
  book_element_darsad = book_element.getElementsByClassName("test-darsad");
  for (let i = 0; i < 7; i++) {
    ghalat = book_darsad_content[i][1];
    kol = books[bookname].test[i];
    nazade = book_darsad_content[i][0];
    sahih = kol - ghalat - nazade;
    darsad = ((sahih - ghalat / 3) / kol) * 100 || 0;
    darsad = Math.ceil(darsad);
    book_element_darsad[i].getElementsByTagName("input")[0].value =
      darsad.toString() + "%";
  }
}
function test_listener(bookname) {
  book_element = document.getElementById(bookname);
  book_element_tests = book_element.getElementsByClassName("test");
  for (let i = 0; i < 7; i++) {
    book_element_tests[i]
      .getElementsByTagName("input")[0]
      .addEventListener("input", function (e) {
        store_new_test_value(bookname, i, e.target.value);
        update_book_test_sum(bookname);
        update_book_darsad(bookname);
      });
    // DARSAD
    book_element_darsad = book_element.getElementsByClassName("test-darsad");
    darsad_element = book_element_darsad[i].getElementsByTagName("input")[0];
    nazade_input = book_element_darsad[i].getElementsByTagName("input")[1];
    ghalat_input = book_element_darsad[i].getElementsByTagName("input")[2];
    // book_element_darsad[i].getElementsByTagName("input")[1].hidden = true;
    // book_element_darsad[i].getElementsByTagName("input")[2].hidden = true;

    // book_element_darsad[i].getElementsByTagName("input")[0].style.height =
    //   "71px";

    nazade_input.addEventListener("input", function (e) {
      store_new_darsad_value_nazade(bookname, i, Number(e.target.value));
      update_book_darsad(bookname);
    });
    ghalat_input.addEventListener("input", function (e) {
      store_new_darsad_value_ghalat(bookname, i, Number(e.target.value));
      update_book_darsad(bookname);
    });

    // darsad_element.addEventListener("mouseenter", (event) => {
    //   event.target.parentElement.getElementsByTagName(
    //     "input"
    //   )[1].hidden = false;
    //   event.target.parentElement.getElementsByTagName(
    //     "input"
    //   )[2].hidden = false;
    // });
    // darsad_element.parentElement.addEventListener("mouseleave", (event) => {
    //   // event.target.parentElement.getElementsByTagName("input")[0].style.height = "71px";
    //   event.target.parentElement.getElementsByTagName("input")[1].hidden = true;
    //   event.target.parentElement.getElementsByTagName("input")[2].hidden = true;
    // });
  }
}
function update_book_test_sum(bookname) {
  //book sums
  books = getStoredBooks();
  test_sum = books[bookname].test.reduce((a, b) => a + b, 0);
  document
    .getElementById(bookname)
    .getElementsByClassName("test-sum")[0].innerText = test_sum;
  // update day sums
  for (let i = 0; i < 7; i++) {
    //each day
    day_sum = 0;
    for (const bookname in books) {
      day_sum += books[bookname].test[i];
    }
    document.getElementById("day-sum").getElementsByClassName("test")[
      i
    ].innerText = day_sum;
    //footer-sum-test

    document.getElementById("footer-sum-test").innerText = day_sum;
  }
  //update footer sum
  sum_test_sum = 0;
  for (let i = 0; i < 7; i++) {
    //each day sum
    document.getElementById("day-sum").getElementsByClassName("test")[i];
    sum_test_sum +=
      document.getElementById("day-sum").getElementsByClassName("test")[i]
        .innerText * 1;
  }
  document.getElementById("footer-sum-test").innerText = sum_test_sum;
}

function time_listener(bookname) {
  book_element = document.getElementById(bookname);
  book_element_times = book_element.getElementsByClassName("time");
  book_element_descs = book_element.getElementsByClassName("desc");
  for (let i = 0; i < 7; i++) {
    book_element_times[i]
      .getElementsByTagName("input")[0]
      .addEventListener("input", function (e) {
        store_new_time_value(bookname, i, e.target.value);
        update_book_time_sum(bookname);
      });
    book_element_descs[i]
      .getElementsByTagName("textarea")[0]
      .addEventListener("input", function (e) {
        store_new_desc_value(bookname, i, e.target.value);
      });
    book_element_times[i]
      .getElementsByTagName("input")[0]
      .addEventListener("blur", function (e) {
        const minutes = timeToMinutes(e.target.value);
        e.target.value = minutesToTime(minutes);
      });
  }
}
function update_book_time_sum(bookname) {
  books = getStoredBooks();
  time_sum = books[bookname].time.reduce((a, b) => a + b, 0);
  document
    .getElementById(bookname)
    .getElementsByClassName("time-sum")[0].innerText = minutesToTime(time_sum);
  // update day sums
  for (let i = 0; i < 7; i++) {
    //each day
    day_sum = 0;
    for (const bookname in books) {
      day_sum += books[bookname].time[i];
    }
    document.getElementById("day-sum").getElementsByClassName("time")[
      i
    ].innerText = minutesToTime(day_sum);
  }

  //update footer sum
  sum_time_sum = 0;
  for (let i = 0; i < 7; i++) {
    //each day sum
    sum_time_sum += timeToMinutes(
      document.getElementById("day-sum").getElementsByClassName("time")[i]
        .innerText
    );
  }
  document.getElementById("footer-sum-time").innerText =
    minutesToTime(sum_time_sum);
}

// PAGE LOADED
document.addEventListener("DOMContentLoaded", function () {
  //load each book from localStorage
  for (const bookname in getStoredBooks()) {
    load_row(bookname);
    // test listeners
    test_listener(bookname);
    // time listeners
    time_listener(bookname);
  }

  document.querySelectorAll("td .test-darsad").forEach(function (el) {
    el.addEventListener("touchstart", function () {
      el.classList.toggle("touched");

      if (el.classList.contains("touched")) {
        el.setAttribute("data-status", "open");
      } else {
        el.setAttribute("data-status", "close");
      }
    });
  });
});
// NEW BOOK SUBMITTED
document.getElementById("submit-book").addEventListener("click", function () {
  bookname = document.getElementById("book-input").value;
  showError(`کتابِ ${bookname} اضافه شد!`, "rgba(52, 184, 255, 0.8)");
  create_row(bookname);
  // test listeners
  test_listener(bookname);
  // time listeners
  time_listener(bookname);
});

// IMPORT NEW TABLE
document.getElementById("load-book").addEventListener("click", function () {
  localStorage.setItem(
    "data",
    LZString.decompressFromBase64(
      document.getElementById("load-input").value.toString()
    )
  );
  showError("درحال بارگزاری گزارش جدید...", "rgba(114, 255, 128, 0.8)");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});

// CLEAR TABLE AND REFRESH
document.getElementById("clear-table").addEventListener("click", function () {
  localStorage.setItem("data", JSON.stringify({}));

  showError("درحال پاک کردن گزارش کار...", "rgba(255, 0, 0, 0.8)");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});

document.getElementById("export").addEventListener("click", function () {
  document.getElementById("export").innerText = "خروجی گرفته شد!";
  navigator.clipboard.writeText(
    LZString.compressToBase64(localStorage.getItem("data"))
  );
  showError("در کلیپبورد شما ذخیره شد!", "rgba(251, 255, 0, 0.8)");
});

function encodeBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}
function decodeBase64(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function showError(message, color) {
  document.getElementsByClassName("error")[0].setAttribute("state", "show");
  document.getElementsByClassName("error")[0].innerText = message;
  document.getElementsByClassName("error")[0].style.backgroundColor = color;
  setTimeout(() => {
    document.getElementsByClassName("error")[0].setAttribute("state", "hide");
  }, 2000);
}
