$(document).ready(function () {
    $("#form1").submit(function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/registration',
            data: $('#form1').serialize(),
            dataType: "json",
            success: function (response) {
                //alert("a");
                //console.log(response.Success);
                $('#form1')[0].reset();

                document.getElementById("check").innerHTML = response.Success;
                //ADD THIS CODE
                setTimeout(function () {
                    document.getElementById("check").innerHTML = "";
                }, 3000);
                if (response.Success == "You are regestered,You can login now.") {
                    document.getElementById("loginaa").click();
                };
            },
            error: function () {
            }
        })
    });




    let imagesPreview = function(input, placeToInsertImagePreview) {
        if (input.files) {
          let filesAmount = input.files.length;
          for (i = 0; i < filesAmount; i++) {
            let reader = new FileReader();
            reader.onload = function(event) {
              $($.parseHTML("<img class='pre-img'>"))
                .attr("src", event.target.result)
                .appendTo(placeToInsertImagePreview);
            };
            reader.readAsDataURL(input.files[i]);
          }
        }
      };
      $("#input-files").on("change", function() {
        imagesPreview(this, "div.preview-images");
      });







});