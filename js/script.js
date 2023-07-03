const dropdowns = document.querySelectorAll(".dropdown-container"),
  inputDropdown = document.getElementById("inputLanguage"),
  outputDropdown = document.getElementById("outputLanguage"),
  inputTextElement = document.getElementById("inputText"),
  outputTextElement = document.getElementById("outputText"),
  inputLanguage = inputDropdown.querySelector(".selected"),
  outputLanguage = outputDropdown.querySelector(".selected"),
  swapBtn = document.querySelector(".swap-position"),
  uploadDocument = document.getElementById("uploadDocument"),
  uploadTitle = document.getElementById("uploadTitle"),
  downloadDocument = document.getElementById("downloadDocument"),
  downloadTitle = document.getElementById("downloadTitle"),
  inputChars = document.getElementById("inputChars"),
  darkModeBtn = document.getElementById("darkModeBtn");

//   Import lis from Language.js
const populateDropdown = (dropdown, options) => {
  dropdown.querySelector("ul").innerHTML = "";
  options.forEach((option) => {
    const li = document.createElement("li");
    const title = option.name + "(" + option.native + ")";
    li.innerHTML = title;
    li.dataset.value = option.code;
    li.classList.add("option");
    dropdown.querySelector("ul").appendChild(li);
  });
};

populateDropdown(inputDropdown, languages);
populateDropdown(outputDropdown, languages);

dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    dropdown.classList.toggle("active");
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("active");
      }
    });
  }
});

document.addEventListener("click", (e) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
    dropdown.querySelectorAll(".option").forEach((item) => {
      item.addEventListener("click", (e) => {
        // remove active class from other option
        dropdown.querySelectorAll(".option").forEach((item) => {
          item.classList.remove("active");
        });
        item.classList.add("active");
        const selected = dropdown.querySelector(".selected");
        selected.innerHTML = item.innerHTML;
        selected.dataset.value = item.dataset.value;
        translate();
      });
    });
  });
});

// Translate text function
const translate = () => {
  const inputText = inputTextElement.value;
  const inputLanguage = inputDropdown.querySelector(".selected").dataset.value;
  const outputLanguage =
    outputDropdown.querySelector(".selected").dataset.value;
  //   api url
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(
    inputText
  )}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      outputTextElement.value = data[0].map((item) => item[0]).join("");
    })
    .catch((error) => console.log(error));
};

inputTextElement.addEventListener("input", (e) => {
  if (inputTextElement.value.length > 5000) {
    inputTextElement.value = inputTextElement.value.slice(0, 5000);
  }
  translate();
});

swapBtn.addEventListener("click", () => {
  const temp = inputLanguage.innerHTML;
  inputLanguage.innerHTML = outputLanguage.innerHTML;
  outputLanguage.innerHTML = temp;
  const tempValue = inputLanguage.dataset.value;
  inputLanguage.dataset.value = outputLanguage.dataset.value;
  outputLanguage.dataset.value = tempValue;
  const tempInputText = inputTextElement.value;
  inputTextElement.value = outputTextElement.value;
  outputTextElement.value = tempInputText;
  translate();
});

uploadDocument.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (
    file.type === "application/pdf" ||
    file.type === "application/msword" ||
    file.type === "text/plain"
  ) {
    uploadTitle.innerHTML = file.name;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      inputTextElement.value = e.target.result;
      translate();
    };
  } else {
    alert("Please select a valid file");
  }
});

downloadDocument.addEventListener("click", (e) => {
  const outputText = outputTextElement.value;
  const outputLanguage = outputDropdown.querySelector(".selected").innerHTML;
  if (outputText) {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `translate-to-${outputLanguage}.txt`;
    a.href = url;
    a.click();
  }
});

inputTextElement.addEventListener("input", (e) => {
  inputChars.innerHTML = e.target.value.length;
});

darkModeBtn.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
