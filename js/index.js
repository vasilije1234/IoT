/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var storage = window.localStorage;
var pixelSlovo = [255, 208, 138];
var pixelSace = [254, 0, 0];
var adresaServera = "http://163.172.139.69/";
var stranica;
var tagID = "";
var idProizvoda;
var original;
var kvalitet;
var iskoriscen;
var ocjena = 1;
var latitude = 0;
var longitude = 0;
var pomocInfoEkran = true;
var jezik = 'mne';

$('#dugmeInformacijeProizvod').on('click', function(){ 
    stranica = "informacijeProizvod";
    if (pomocInfoEkran)
        $.mobile.navigate("#informacijeOProizvoduUpustvo");
    else
        $.mobile.navigate("#kamera");
});

$('#DugmePocetakSkeniranjaInformacijeOProizvodu').on('click', function(){ 
    stranica = "informacijeProizvod";
    $.mobile.navigate("#kamera");  
});

$('#kameraDugme').on('click', function(){ 
    $.mobile.navigate("#kamera");   
});

$('#dugmeOcijeniProizvod').on('click', function(){ 
    stranica = "ocijeniProizvod";
    if (pomocInfoEkran)
        $.mobile.navigate("#ocjenaProizvodaUpustvo");
    else
        $.mobile.navigate("#kamera");
});

$('#DugmePocetakSkeniranjaOcjenaProizvoda').on('click', function(){ 
    stranica = "ocijeniProizvod";
    $.mobile.navigate("#kamera");  
});


$('#dugmePrijaviProizvod').on('click', function(){ 
    stranica = "prijavaProizvoda";
    if (pomocInfoEkran)
        $.mobile.navigate("#prijavaProizvodaUpustvo");
    else
        $.mobile.navigate("#kamera"); 
});

$('#DugmePocetakSkeniranjaPrijavaProizvoda').on('click', function(){ 
    stranica = "prijavaProizvoda";
    $.mobile.navigate("#kamera");  
});

$('#dugmeProizvodjaci').on('click', function(){ 
    $.mobile.navigate("#proizvodjaci");   
});

$('#pomocDaNePanelDugme').on('change', function(){ 
    if ($('#pomocDaNePanelDugme').val() == "Da")
        pomocInfoEkran = true;
    else
        pomocInfoEkran = false;
    storage.setItem('pomocInfoEkran', pomocInfoEkran);
});

$('#jezik').on('change', function(){ 
    jezik = $('#jezik').val();
    storage.setItem('jezik', jezik);
    prevedi();
    $('#pomocDaNePanelDugme').trigger("change");
});

$('#testProizvod').on('click', function(){ 
    $.ajax({
        url: 'http://api.tagitsmart.eu/producer/products',
        dataType: 'json',
        type: 'get',
        contentType: 'application/json',
        processData: false,
        success: function( data, textStatus, jQxhr ){
            alert(data[0].Name);
            $.mobile.navigate("#home");  
        },
        error: function( jqXhr, textStatus, errorThrown ){
            alert(porukaOdabraniJezik.serverNedostupan);
            navigator.app.exitApp();
        },
        beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token ); }
    });    
});

$('#DugmeOcjenaProizvoda').on('click', function(){ 
    $.mobile.loading( "show", {
      text: porukaOdabraniJezik.loadingCekaj,
      textVisible: true,
      theme: "a",
      html: ""
    });
    var pom = tagID.split('/');
    idProizvoda = pom[pom.length-1];
    $.post(adresaServera + "oznaci.php",
    {
        // Data sent along with a request
        ProductId: idProizvoda,
        Comment: $('#TekstKomentarPrijavaProizvoda').val()
    },
    function(data, status, xhr) { 
        if (data == "Nema")
            alert(porukaOdabraniJezik.nemaTaga);
        else
        {
            var odgovorServer = JSON.parse(data);
            if (odgovorServer.status == "ok"){
                $.ajax({
                url: 'http://api.tagitsmart.eu/products/review',
                dataType: 'json',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify( {"ProductId": idProizvoda, "Comment":  $('#tekstKomentarOcjena').val(),"ReviewStars":ocjena} ),
                processData: false,
                success: function( data, textStatus, jQxhr ){
                    //alert(JSON.stringify(data));
                    alert(porukaOdabraniJezik.ocjenaPoslata);
                    $.mobile.navigate("#home");
                    $('#tekstKomentarOcjena').val('');
                },
                error: function( jqXhr, textStatus, errorThrown ){
                    alert(porukaOdabraniJezik.problemKomentar);
                    $.mobile.navigate("#home");
                },
                beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + token ); }
                });
            }
            else 
                alert(porukaOdabraniJezik.prijavaGreska);
        }
        $.mobile.navigate("#home");  
    })
    .fail(function(error, status, xhr) {
        // Failure callback
        alert('Status: ' + status + '\nRazlog: ' + xhr);
        $.mobile.loading( "hide" );
    });    
});

$('#DugmePrijavaProizvoda').on('click', function(){ 
    $.mobile.loading( "show", {
      text: porukaOdabraniJezik.loadingCekaj,
      textVisible: true,
      theme: "a",
      html: ""
    });
    var pom = tagID.split('/');
    idProizvoda = pom[pom.length-1];
    $.post(adresaServera + "prijavi.php",
    {
        // Data sent along with a request
        ProductId: idProizvoda,
        Comment: $('#TekstKomentarPrijavaProizvoda').val()
    },
    function(data, status, xhr) {
        
        if (data == "Nema")
            alert(porukaOdabraniJezik.nemaTaga);
        else
        {
            var odgovorServer = JSON.parse(data);
            if (odgovorServer.status == "ok")
                alert(porukaOdabraniJezik.prijavaPoslata);
            else 
                alert(porukaOdabraniJezik.prijavaGreska);
        }
        $.mobile.navigate("#home");  
    })
    .fail(function(error, status, xhr) {
        // Failure callback
        alert('Status: ' + status + '\nRazlog: ' + xhr);
        $.mobile.loading( "hide" );
    });
    $('#TekstKomentarPrijavaProizvoda').val('');
});

document.addEventListener("deviceready", onDeviceReady, false);

// Dugmad i slike na kameri
var rect;
var take_pic_btn;
var flash_on_btn;
var flash_off_btn;
var token;

function onBackKeyDown() {
    if($.mobile.activePage.attr('id') == 'kamera' || $.mobile.activePage.attr('id') == 'proizvodInfo'  || $.mobile.activePage.attr('id') ==  'informacijeOProjektu' || $.mobile.activePage.attr('id') == 'ocjenaProizvoda' || $.mobile.activePage.attr('id') == 'prijavaProizvoda' || $.mobile.activePage.attr('id') == 'proizvodjaci' || $.mobile.activePage.attr('id')=='informacijeOProizvoduUpustvo' || $.mobile.activePage.attr('id')=='ocjenaProizvodaUpustvo'  || $.mobile.activePage.attr('id')=='prijavaProizvodaUpustvo')
        $.mobile.navigate( "#home" );
    if($.mobile.activePage.attr('id') == 'home')
        izadjiIzAplikacije();
}

function izadjiIzAplikacije(){
    if (confirm(porukaOdabraniJezik.potvrdaIzlaz))
        navigator.app.exitApp();
}

// Funkcija za ocjenu
$(function () {
	var that = this;
	var toolitup = $("#jRate").jRate({
		rating: 1,
        startColor: "#F9B233",
        endColor: "#F9B233",
		strokeColor: 'black',
        shapeGap: '10px',
		precision: 1,
		minSelected: 1,
        width: 50,
        height: 50,
		onChange: function(rating) {
		  ocjena = rating;
			//console.log("OnChange: Rating: "+rating);
		},
		onSet: function(rating) {
			ocjena = rating;
            //console.log("OnSet: Rating: "+rating);
		}
	});
});


function onDeviceReady() {
        // Postavke zapamcene u bazi
        var jezikBaza = storage.getItem('jezik');
        if (jezikBaza == null)
            storage.setItem('jezik', 'mne');
        else
            jezik = jezikBaza;

        var pomocInfoEkranBaza = storage.getItem('pomocInfoEkran');
        if (pomocInfoEkranBaza == null)
            storage.setItem('pomocInfoEkran', true);
        else{
            pomocInfoEkran = !!pomocInfoEkranBaza;
        }
        
        prevedi();
        $('#jezik').val(jezik);        
        if (!pomocInfoEkran)  $('#pomocDaNePanelDugme').val('Ne');

        /////////////////////////////////////////////////////////////
        document.addEventListener("backbutton", onBackKeyDown, false);
                
        $.ajax({
            url: 'http://api.tagitsmart.eu/account/login',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify( {"Username": "marko.simeunovic@udg.edu.me", "Password":  "Medena123"} ),
            processData: false,
            success: function( data, textStatus, jQxhr ){
                token = data.Token;
                $.mobile.navigate("#home");  
            },
            error: function( jqXhr, textStatus, errorThrown ){
                alert(porukaOdabraniJezik.serverNedostupan);
                navigator.app.exitApp();
            }
        });

        if (window.screen.height/window.screen.width !=16/9)
        {
            $("#PozadinaTopNaslovna").height(150);
            $("#PozadinaTopPrijavaProizvoda").height(150);
        }


        // Uzimamo geolokaciju    
        var onSuccess = function(position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        };
    
        // onError Callback receives a PositionError object
        function onError(error) {
            latitude = 0;
            longitude = 0;
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
    
    $(document).delegate("#kamera", "pageshow", function() {
        app.init();
        app.startCameraBelow();	
         
		$(".ui-overlay-a").css( "background-color", "transparent");
        $(".ui-page").css( "background-color", "transparent");
        /*
        $( "*" ).each(function( index ) {
            alert( index + ": " + $(this).attr('class') +"->" + $(this).css( "background-color") );
        });*/
        
        // Create a rectangle & buttons
        rect = document.createElement('div');
        take_pic_btn = document.createElement('img');
        flash_on_btn = document.createElement('img');
        flash_off_btn = document.createElement('img');

        // You must specify path relative to www folder
        take_pic_btn.src = 'img/take_photo.png';
        flash_on_btn.src = 'img/flash_on.svg';
        flash_off_btn.src = 'img/flash_off.svg';

        // Add styles
        rect.className += 'rect_class';
        take_pic_btn.className += ' take_pic_class'
        flash_on_btn.className += ' flash_class'
        flash_off_btn.className += ' flash_class'

        // Hide flash_off btn by default
        flash_off_btn.style.visibility = 'hidden';

        // Append to body section
        document.body.appendChild(rect);
        document.body.appendChild(take_pic_btn);
        document.body.appendChild(flash_on_btn);
        document.body.appendChild(flash_off_btn);

        // Get rectangle coordinates
        var rect_coords = rect.getBoundingClientRect();
        var x_coord = rect_coords.left, y_coord = rect_coords.top;

        take_pic_btn.onclick = function(){
            // Get rectangle size
            var rect_width = rect.offsetWidth, rect_height = rect.offsetHeight;

            CameraPreview.takePicture(function(base64PictureData) {

                // We pass width, height, x and y coordinates of our rectangle to crop method
                // At the very end, crop methods send cropped image to server
                var cropped_img = crop(base64PictureData, rect_width, rect_height, x_coord, y_coord, function(cropped_img_base64,izdvojenaSlika) {
				    /*
                    // Provjera prvo piksela
                    var i, br1 = 0,br2 = 0, raz1, raz2;
                    for (i = 0; i < imgData.data.length; i += 4) {
                        raz1 = deltaE(rgb2lab([imgData.data[i],imgData.data[i+1],imgData.data[i+2]]),rgb2lab(pixelSlovo));
                        if (raz1 <8) br1++;
                        raz2 = deltaE(rgb2lab([imgData.data[i],imgData.data[i+1],imgData.data[i+2]]),rgb2lab(pixelSace));
                        if (raz2 <8) br2++;
                    }
                    
                    if (br1 < 10) alert('Nema slova');
                    //alert([br1,br2]);
					*/
					qrcode.callback = function(data) {
						if (data == 'error decoding QR Code')
						{
                            alert(porukaOdabraniJezik.skeniranjeGreska);
							//take_pic_btn.click();
						}
						else
                        {
							//alert(data);
                            tagID = data;
                            $.mobile.loading( "show", {
                              text: porukaOdabraniJezik.loadingProvjeraKoda,
                              textVisible: true,
                              theme: "a",
                              html: ""
                            });
                            
                            $.post(adresaServera,
                                {
                                    // Data sent along with a request
                                    image: izdvojenaSlika,
                                    lat: latitude,
                                    lon: longitude,
                                    IDtag: tagID
                                },
                                function(data, status, xhr) {
                                    // Success callback
                                    if (data == "Nema"){
                                        alert(porukaOdabraniJezik.nemaTaga);
                                        $.mobile.loading( "hide" );
                                        $.mobile.navigate("#home");
                                    }
                                    else{
                                        //alert(data);
                                        var odgovor = JSON.parse(data);
                                        original = odgovor.original;
                                        kvalitet = odgovor.kvalitet;
                                        iskoriscen = odgovor.iskoriscen;
                                        //alert(iskoriscen);
                                        //alert('Status: ' + status + '\nData: ' + odgovor.original + ' stranica ' + stranica);
                                        if (stranica == 'informacijeProizvod'){
                                            $.ajax({
                                                url: tagID,
                                                dataType: 'json',
                                                type: 'get',
                                                contentType: 'application/json',
                                                processData: false,
                                                success: function( data, textStatus, jQxhr ){
                                                    $.mobile.loading( "hide" );
                                                    $("#NazivProizvodaProizvodInfo").html(data.ProductName);
                                                    $("#SlikaProizvodInfo").attr("src", data.ProductImageURL);
                                                    
                                                    var priv = JSON.parse(data.Description);
                                                    var opis;
                                                    if (jezik == 'mne')
                                                        opis = priv.mne;
                                                    if (jezik == 'eng')
                                                        opis = priv.eng;
                                                    
                                                    $("#OpisProizvodInfo").html(opis.opis);
                                                    $("#ProizvodjacProizvodInfo").html(opis.proizvodjac);
                                                    $("#PasnjakProizvodInfo").html(opis.pasnjak);
                                                    if (iskoriscen == "da"){
                                                        $("#OriginalnostProizvodInfo").html(porukaOdabraniJezik.statusKonzumiran);
                                                    }
                                                    else{
                                                        if(original == "da"){
                                                            $("#OriginalnostProizvodInfo").html(porukaOdabraniJezik.statusOriginal);
                                                        }
                                                        else{
                                                            $("#OriginalnostProizvodInfo").html(porukaOdabraniJezik.statusProblemOriginal);                
                                                        }
                                                    }
                                                    if(kvalitet == "da"){
                                                        $("#KvalitetProizvodInfo").html(porukaOdabraniJezik.statusKvalitetOK);
                                                    }
                                                    else{
                                                        $("#KvalitetProizvodInfo").html(porukaOdabraniJezik.statusKvalitetOK);                
                                                    }
                                                    
                                                    $.mobile.navigate("#proizvodInfo");
                                                },
                                                error: function( jqXhr, textStatus, errorThrown ){
                                                    alert(porukaOdabraniJezik.serverNedostupan);
                                                    $.mobile.navigate("#home");
                                                }
                                            });                                            
                                        }                                    
                                        if (stranica == 'ocijeniProizvod'){
                                            if (original == "da" && kvalitet == "da" && iskoriscen == "ne")
                                            {
                                                $.ajax({
                                                    url: tagID,
                                                    dataType: 'json',
                                                    type: 'get',
                                                    contentType: 'application/json',
                                                    processData: false,
                                                    success: function( data, textStatus, jQxhr ){
                                                        if (original == "da" && kvalitet == "da")
                                                        {
                                                            $("#NaslovOcjenaProizvoda").html("Proizvod: " + data.ProductName);
                                                            $.mobile.loading( "hide" );
                                                            $.mobile.navigate("#ocjenaProizvoda");
                                                        }
                                                        else
                                                        {
                                                        }
                                                    },
                                                    error: function( jqXhr, textStatus, errorThrown ){
                                                        alert(porukaOdabraniJezik.serverNedostupan);
                                                        $.mobile.navigate("#home");
                                                    }
                                                });
                                            }
                                            else
                                            {
                                                if (original == "ne")
                                                    alert(porukaOdabraniJezik.porukaNijeOriginal);
                                                else
                                                    if (kvalitet == "ne")
                                                        alert(porukaOdabraniJezik.porukaProblemKvalitet);
                                                    else
                                                        alert(porukaOdabraniJezik.porukaProblemKonzumiran);
                                                $.mobile.navigate("#home");                                                
                                            }                                            
                                        }                                    
                                        if (stranica == 'prijavaProizvoda'){
                                            if (original == "da" && kvalitet == "da" && iskoriscen == "ne")
                                            {
                                                $.ajax({
                                                    url: tagID,
                                                    dataType: 'json',
                                                    type: 'get',
                                                    contentType: 'application/json',
                                                    processData: false,
                                                    success: function( data, textStatus, jQxhr ){
                                                        if (original == "da")
                                                        {
                                                            $("#NaslovPrijavaProizvoda").html("Proizvod: " + data.ProductName);
                                                            $.mobile.loading( "hide" );
                                                            $.mobile.navigate("#prijavaProizvoda");
                                                        }
                                                        else
                                                        {
                                                            alert(porukaOdabraniJezik.porukaProblemOriginalKvalitet);
                                                            $.mobile.navigate("#home");
                                                        }
                                                    },
                                                    error: function( jqXhr, textStatus, errorThrown ){
                                                        alert(porukaOdabraniJezik.serverNedostupan);
                                                        $.mobile.navigate("#home");
                                                    }
                                                });  
                                            }
                                            else
                                            {
                                                if (original == "ne")
                                                    alert(porukaOdabraniJezik.porukaProblemOriginalKvalitet);
                                                else
                                                    if (kvalitet == "ne")
                                                        alert(porukaOdabraniJezik.porukaVecOznacenKvalitet);
                                                    else
                                                        alert(porukaOdabraniJezik.porukaVecOznacenKonzumiranKvalitet);
                                                $.mobile.navigate("#home");                                                
                                            }                                                                                      
                                        }
                                    }                                   
                                }
                            )
                            .fail(function(error, status, xhr) {
                                // Failure callback
                                alert('Status: ' + status + '\nRazlog: ' + xhr);
                                $.mobile.loading( "hide" );
                            });
                        }
					}	
                    if (cropped_img_base64==null)
                        alert(porukaOdabraniJezik.skeniranjeGreska);
					else
                        qrcode.decode(cropped_img_base64);
                });
            });
        };

        flash_on_btn.onclick = function() {
            flash_mode = 'on';
            flash_off_btn.style.visibility = 'visible';
            flash_on_btn.style.visibility = 'hidden';			
            CameraPreview.setFlashMode('torch');
        }

        flash_off_btn.onclick = function() {
            flash_mode = 'off';
            flash_off_btn.style.visibility = 'hidden';
            flash_on_btn.style.visibility = 'visible';
            CameraPreview.setFlashMode(flash_mode);
        }

    });
    $(document).delegate("#kamera", "pagehide", function() {
        app.stopCamera(); 
        rect.remove();  
        take_pic_btn.remove();
        flash_on_btn.remove();
        flash_off_btn.remove();    
    });
}

$(document).delegate("#proizvodjaci", "pageshow", function() {

    $.mobile.loading( "show", {
      text: porukaOdabraniJezik.loadingCekaj,
      textVisible: true,
      theme: "a",
      html: ""
    });

    $.post(adresaServera + "proizvodjaci.php",
    {
        podaci: "daj proizvodjace"
    },
    function(data, status, xhr) {
        var pom = JSON.parse(data);
        var t = "",i;
        for (i = 0; i<pom.length;i++)
            t = t + '<li><a href="' + pom[i].link + '">' + pom[i].naziv + '</a></li>';
        $("#listaProizvodjaci").html(t);
        $('#listaProizvodjaci').listview('refresh');
        $.mobile.loading( "hide" );
    })                            
    .fail(function(error, status, xhr) {
        // Failure callback
        alert('Status: ' + status + '\nRazlog: ' + xhr);
        $.mobile.loading( "hide" );
        $.mobile.navigate("#home");
    });
});

var flash_mode = 'off';

var app = {
  startCameraAbove: function(){
    CameraPreview.startCamera({x: 0, y: 0, width: window.screen.width, height: window.screen.height, toBack: false, previewDrag: true, tapPhoto: true});
  },

  startCameraBelow: function(){
    CameraPreview.startCamera({x: 0, y: 0, width: window.screen.width, height: window.screen.height, camera: "back", tapPhoto: true, previewDrag: false, toBack: true});
  },

  stopCamera: function(){
    CameraPreview.stopCamera();
  },

  takePicture: function(){
    CameraPreview.takePicture(function(imgData){
      document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
    });
  },

  switchCamera: function(){
    CameraPreview.switchCamera();
  },

  show: function(){
    CameraPreview.show();
  },

  hide: function(){
    CameraPreview.hide();
  },

  changeColorEffect: function(){
    var effect = document.getElementById('selectColorEffect').value;
    CameraPreview.setColorEffect(effect);
  },

  changeFlashMode: function(){
    var mode = document.getElementById('selectFlashMode').value;
    CameraPreview.setFlashMode(mode);
  },

  changeZoom: function(){
    var zoom = document.getElementById('zoomSlider').value;
    document.getElementById('zoomValue').innerHTML = zoom;
    CameraPreview.setZoom(zoom);
  },

  changePreviewSize: function(){
    window.smallPreview = !window.smallPreview;
    if(window.smallPreview){
      CameraPreview.setPreviewSize({width: 100, height: 100});
    }else{
      CameraPreview.setPreviewSize({width: window.screen.width, height: window.screen.height});
    }
  },

  showSupportedPictureSizes: function(){
    CameraPreview.getSupportedPictureSizes(function(dimensions){
      dimensions.forEach(function(dimension) {
        console.log(dimension.width + 'x' + dimension.height);
      });
    });
  },

  init: function(){

  }
};


