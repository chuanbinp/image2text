function clear_outputs(){
  $("#download_btn ").css("display", "none");
  $("#copy_btn ").css("display", "none");
  $("#ocr_text ").css("display", "none");
  $("#scan_image ").css("display", "none");
}

function scan_btn_clicked(){
  clear_outputs();
  $("#upload_div > h1").text("Uploaded File");
  $("form").css("width", "80%");
  $("img:not(.load_img)").css("max-width", "75%");
  $("#scan_div").css("display", "block");
  $("#ocr_div").css("display", "none");
  $('#scan_load').show();
  $("#upload_div").css("background-color", "#2980b9");
  $('html, body').animate({
    scrollTop: $("#scan_div").offset().top
}, 1000);
};

function ocr_btn_clicked(){
  clear_outputs();
  $("#upload_div > h1").text("Uploaded File");
  $("form").css("width", "80%");
  $("img:not(.load_img)").css("max-width", "75%");
  $("#scan_div").css("display", "block");
  $("#ocr_div").css("display", "block");
  $('#scan_load').show();
  $('#ocr_load').show();
  $("#upload_div").css("background-color", "#2980b9");
  $('html, body').animate({
    scrollTop: $("#ocr_div").offset().top
}, 1000);
};

function file_supported(file){
  $("#file_support").text("is supported.");

  var reader = new FileReader();
  reader.onload = function (e) {
      $('#uploaded_image').attr('src', e.target.result)
  };
  reader.readAsDataURL(file);
  console.log("Supported.");
  $('#uploaded_image').show();
  $("#scan_btn").show();
  $("#ocr_btn").show();
  $('html, body').animate({
    scrollTop: $(".flex-container").offset().top
}, 1000);
}

function file_not_supported(){
  $("#file_support").text("is NOT supported.")
  document.getElementById("file-picker").value ="";
  $("#scan_btn").hide();
  $("#ocr_btn").hide();
  $('#uploaded_image').hide();
}

function file_not_attached(){
  $("#file_support").text("Please select a file.");
  $("#file_name").text("");
  document.getElementById("file-picker").value ="";
  $("#scan_btn").hide();
  $("#ocr_btn").hide();
  $('#uploaded_image').hide();
}

function send_scan_api(){
  console.log("Send to scan API")

  var fd = new FormData();
  var files = $('#file-picker')[0].files[0];
  fd.append('file',files);

  $.ajax({
    url: 'https://imagetotextserver.herokuapp.com/scan',
    type: 'POST',
    data: fd,
    contentType: false,
    cache: false,
    processData: false,
    success: function(response){
        var obj = JSON.parse(response)

        $("#scan_image").attr("src", "data:image/png;base64,"+obj.scanned_image);
        $("#download_btn").attr("href", "data:image/png;base64,"+obj.scanned_image);
        $("#download_btn").show();
        $("#scan_image").show();
        $('#scan_load').hide();

        $("#scan_btn").attr("disabled", false);
        $("#ocr_btn").attr("disabled", false);
        $("#file_btn").attr("disabled", false);
        $("#file-picker").attr("disabled", false);
        }
    })
}

function ocr_now(scanned_image){
    $.ajax({
    url: 'https://imagetotextserver.herokuapp.com/ocr',
    type: 'POST',
    data: scanned_image,
    contentType: false,
    cache: false,
    processData: false,
    success: function(response){
        var obj = JSON.parse(response)

        $("#ocr_text").text(obj.ocr_text);
        $("#ocr_text").show();
        $("#copy_btn").show();
        $("#ocr_load").hide();

        $("#scan_btn").attr("disabled", false);
        $("#ocr_btn").attr("disabled", false);
        $("#file_btn").attr("disabled", false);
        $("#file-picker").attr("disabled", false);
        }
    });
    return
}


function send_ocr_api(){
  console.log("Send to ocr API")

  var fd = new FormData();
  var files = $('#file-picker')[0].files[0];
  fd.append('file',files);

  $.ajax({
    url: 'https://imagetotextserver.herokuapp.com/scan',
    type: 'POST',
    data: fd,
    contentType: false,
    cache: false,
    processData: false,
    success: function(response){
        var obj = JSON.parse(response)

        $("#scan_image").attr("src", "data:image/png;base64,"+obj.scanned_image);
        $("#download_btn").attr("href", "data:image/png;base64,"+obj.scanned_image);
        $("#download_btn").show();
        $("#scan_image").show();
        $('#scan_load').hide();
        ocr_now(obj.scanned_image);
        }
    })
}

$("#file-picker").change(function(){
    var input = document.getElementById('file-picker');
    if(input.files[0]){
      $("#file_name").text(input.files[0].name);
      var ext= input.files[0].name.substring(input.files[0].name.lastIndexOf('.')+1).toLowerCase()

      if ((ext == 'jpg') || (ext == 'png') || (ext == 'jpeg')){
          file_supported(input.files[0]);
      }
      else{
          file_not_supported();
      }
    }
    else{
      file_not_attached();
    }
});



$("#upload-form").submit(function (e) {
    var button_selected = document.activeElement.id;
    $("#scan_btn").attr("disabled", true);
    $("#ocr_btn").attr("disabled", true);
    $("#file_btn").attr("disabled", true);
    $("#file-picker").attr("disabled", true);

    if(button_selected == 'scan_btn'){
      //$("#scan_btn").attr("disabled", true);
      scan_btn_clicked();
      send_scan_api();
    }
    else if (button_selected == 'ocr_btn'){
      ocr_btn_clicked();
      send_ocr_api();
    }

    // $("#scan_btn").attr("disabled", false);
    // $("#ocr_btn").attr("disabled", false);
});

$("#copy_btn").click(function () {
    $("#ocr_text").select();
    document.execCommand('copy');
    $("#copy_status").html("<strong>Copied!</strong>");
    document.getSelection().removeAllRanges();

    window.setTimeout(function(){
      $('#copy_status').text("");
    }, 1000);
});

$(".btn").click(function () {
  $('html, body').animate({
    scrollTop: $(".flex-container").offset().top
}, 1000);
});
