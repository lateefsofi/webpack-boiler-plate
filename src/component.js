export default (text = "Hello world man, how are you!") => {
  const element = document.createElement("div");

  element.innerHTML = text;

  return element;
};