const addOptionButton = document.querySelector('.addNewOption');
const optionsContainer = document.querySelector('.options');

addOptionButton.addEventListener('click', (e) => {
  e.preventDefault();
  const newOption = '<input type="text" placeholder="option" name="option" style="margin-top: 10px"/>';
  optionsContainer.innerHTML += newOption;
});