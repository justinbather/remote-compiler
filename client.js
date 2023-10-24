const handleSubmit = async () => {
  const code = document.getElementById("code").value;

  try {
    const response = await axios.post(
      "http://localhost:3000/compile-test",
      { code: code, lang: "Javascript" },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      }
    );
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }

  //   console.log(code);
};

const submitButton = document.getElementById("compileButton");
submitButton.addEventListener("click", handleSubmit);
