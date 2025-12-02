function addMsg(msg) {
    return `    
  <li class="list-group-item">
    <strong class="me-2">${msg.username}: </strong>
    <span>${msg.message}.</span>
  </li>`
}


$.getJSON("/get-all-messages", function () {
    console.log("success");
}).done(function (data) {
    console.log(data);
    if (data.message === 'success') {
        data.data.forEach((item) => {
            $('#messages').prepend(
                addMsg(item)
            );
        })
    }
});