/* ------ Variables globales ------ */
var TOTALSCORE = 0;
var CURRENTSCORE = 0;
var MAXSCORE = 0;
var LEVEL = 1;
var rows = ['A', 'B', 'C', 'D', 'E'];
var columns = [1, 2, 3, 4, 5];

/* ------ Script à exécuter au chargement du DOM ------ */
$(function()
{
	/* ------ récupération des éléments HTML ------ */

	$plateau = $('#plateau');
	$chests = $('.chest'); // cellules des coffres
	$cellContent = $('.text-content'); //valeur des coffres

	//boutons
	$save = $('#save');
	$levelDown = $('#level-down');
	$infoBtn = $('#help');

	//affichage
	$currentScore = $('#current-score');
	$totalScore = $('#total-score');
	$maxScore = $('#max-score');
	$level = $('#level');

	//indicateurs
	$bombIndic = $('.bomb-indic');
	$x1Indic = $('.x1-indic');
	$x2Indic = $('.x2-indic');
	$x3Indic = $('.x3-indic');

	//modal
	$infoModal = $('#infoModal');
	$span = $('.close'); //bouton X


	/* ------ gestionnaires d'événements ------ */

	$cellContent.on('click', openChest); //ouverture du coffre au clic
	$bombIndic.on('click', select); // sélection de l'indicateur au clic
	$x1Indic.on('click', select); // sélection de l'indicateur au clic
	$x2Indic.on('click', select); // sélection de l'indicateur au clic
	$x3Indic.on('click', select); // sélection de l'indicateur au clic
	$save.on('click', saveScore); // sauvegarde du score au clic sur "changer de salle" et nouvelle salle
	//retour au niveau 1 au clic sur le bouton "niveau 1"
	$levelDown.on('click', function() {
		LEVEL = 1;
		$level.html('Etage n°'+LEVEL);
		init();
	});
	
	//affichage de la modal au clic sur le bouton
	$infoBtn.on('click', function() {
	    $infoModal.css('display', 'block');
	});

	//fermeture de la modal au clic sur la croix
	$span.on('click', function() {
	    $infoModal.css('display', 'none');
	});

	//fermeture de la modal au clic en-dehors de la modal
	$(window).on('click', function(event) {
	    if (event.target == $infoModal) {
	        $infoModal.css('display', 'none');
	    }
	});

	init();	//nouvelle grille
	
});

//obtenir un entier aléatoire entre min et max
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

//nouvelle grille
function init() {
	$cellContent.html('');	//suppression de l'ancienne valeur des coffres
	//suppression des classes d'affichage et des classes de valeur
	$chests.each(function() {
		if ($(this).hasClass('open'))
		{
			$(this).removeClass('open');
			$(this).addClass('closed');
		}
		else if ($(this).hasClass('empty'))
		{
			$(this).removeClass('empty');
			$(this).addClass('closed');
		}
		else if ($(this).hasClass('boom'))
		{
			$(this).removeClass('boom');
			$(this).addClass('closed');
		}

		if ($(this).hasClass('bomb'))
		{
			$(this).removeClass('bomb');
		}
		else if ($(this).hasClass('x3'))
		{
			$(this).removeClass('x3');
		}
		else if ($(this).hasClass('x2'))
		{
			$(this).removeClass('x2');
		}
		else if ($(this).hasClass('x1'))
		{
			$(this).removeClass('x1');
		}
	});
	//mise en place des classes de valeur
	placeBombs();
	placeX3();
	placeX2();
	placeX1();
	//compte des coffres piégés et des points
	countBombs();
	countPoints();
	//remise à zéro des indicateurs
	resetSelect();
}

//mise en place aléatoire des coffres piégés
function placeBombs() {
	//définition du nombre de pièges à placer (augmente avec le niveau)
	if (LEVEL == 1)
	{
		var random = getRandomIntInclusive(6, 7);
	}
	else if (LEVEL == 2)
	{
		var random = getRandomIntInclusive(7, 8);
	}
	else if (LEVEL == 3)
	{
		var random = getRandomIntInclusive(7, 9);
	}
	else if (LEVEL >= 4)
	{
		var random = getRandomIntInclusive(8, 10);
	}

	//pour chacun des pièges à placer
	for (var i = 0; i < random; i++) {
		//sélection d'un coffre au hasard
		var $chest = randomChest();
		//choix d'un autre coffre s'il est déjà piégé
		while ($chest.hasClass('bomb'))
		{
			$chest = randomChest();
		}
		//mise en place du piège
		$chest.addClass('bomb');
	};
}

//mise en place aléatoire de coffres x3
function placeX3() {
	//définition du nombre de coffres x3 à placer (augmente avec le niveau)
	if (LEVEL == 1)
	{
		var random = getRandomIntInclusive(0, 2);
	}
	else if (LEVEL == 2)
	{
		var random = getRandomIntInclusive(1, 3);
	}
	else if (LEVEL == 3)
	{
		var random = getRandomIntInclusive(2, 4);
	}
	else if (LEVEL >= 4)
	{
		var random = getRandomIntInclusive(3, 5);
	}

	//pour chacun des coffres à placer
	for (var i = 0; i < random; i++) {
		//sélection d'un coffre au hasard
		var $chest = randomChest();
		//choix d'un autre coffre s'il est déjà défini
		while ($chest.hasClass('bomb') || $chest.hasClass('x3'))
		{
			$chest = randomChest();
		}
		//mise en place du x3
		$chest.addClass('x3');
	};
}

//mise en place aléatoire de coffres x2
function placeX2() {
	//définition du nombre de coffres x2 à placer (augmente avec le niveau)
	if (LEVEL == 1)
	{
		var random = getRandomIntInclusive(1, 5);
	}
	else if (LEVEL == 2)
	{
		var random = getRandomIntInclusive(2, 6);
	}
	else if (LEVEL == 3)
	{
		var random = getRandomIntInclusive(3, 7);
	}
	else if (LEVEL >= 4)
	{
		var random = getRandomIntInclusive(4, 8);
	}

	//pour chacun des coffres à placer
	for (var i = 0; i < random; i++) {
		//sélection d'un coffre au hasard
		var $chest = randomChest();
		//nombre d'essai limité pour éviter de ralentir le script
		var tryNbr = 0;
		//choix d'un autre coffre s'il est déjà défini
		while ($chest.hasClass('bomb') || $chest.hasClass('x3') || $chest.hasClass('x2') || tryNbr < 5)
		{
			$chest = randomChest();
			tryNbr++;
		}
		//mise en place du x2
		$chest.addClass('x2');
	};
}

//mise en place de coffres x1 sur tous les coffres non-définis
function placeX1() {
	$chests.each(function() {
		if (!$(this).hasClass('bomb') && !$(this).hasClass('x3') && !$(this).hasClass('x2'))
		{
			$(this).addClass('x1');
		}
	});
}

//compte et affichage du nombre de coffres piégés
function countBombs() {
	//détection des coffres piégés pour chaque rangée
	for (var i = 0; i < rows.length; i++) 
	{
		//récupération de la lettre de la rangée
		rowLetter = rows[i];
		var count = 0;
			for (var j = 0; j < columns.length; j++) 
			{
				//id du coffre = rangée-colonne, récupération de l'élément HTML
				columnNumber = columns[j];
				cell = "#"+rowLetter+columnNumber;
				$cell = $(cell);
				//+1 s'il y a un piège
				if ($cell.hasClass('bomb'))
				{
					count++;
				}
			}
		//id du compte de pièges
		$rowCount = $('#count'+rowLetter);
		//affichage HTML
		$trapCount = $rowCount.find(".trap-count").html('<i class="fa fa-bolt" aria-hidden="true"> '+count+'</i>');
	};

	/* détection des coffres piégés pour chaque colonne*/
	for (var i = 0; i < columns.length; i++) 
	{
		//récupération du numéro de la colonne
		columnNumber = columns[i];
		var count = 0;
			for (var j = 0; j < rows.length; j++) 
			{
				//id du coffre = rangée-colonne, récupération de l'élément HTML
				rowLetter = rows[j];
				cell = "#"+rowLetter+columnNumber;
				$cell = $(cell);
				//+1 s'il y a un piège
				if ($cell.hasClass('bomb'))
				{
					count++;
				}
			}
		//id du compte de pièges
		$columnCount = $('#count'+columnNumber);
		//affichage HTML
		$trapCount = $columnCount.find(".trap-count").html('<i class="fa fa-bolt" aria-hidden="true"> '+count+'</i>');
	};
}

function countPoints() {
	/* détection des points pour chaque rangée*/
	for (var i = 0; i < rows.length; i++) 
	{
		//récupération de la lettre de la rangée
		rowLetter = rows[i];
		var count = 0;
			for (var j = 0; j < columns.length; j++) 
			{
				//id du coffre = rangée-colonne, récupération de l'élément HTML
				columnNumber = columns[j];
				cell = "#"+rowLetter+columnNumber;
				$cell = $(cell);
				//augmentation du compte de points pour chaque coffre non-piégé
				if ($cell.hasClass('x3'))
				{
					count += 3;
				}
				else if ($cell.hasClass('x2'))
				{
					count += 2;
				}
				else if ($cell.hasClass('x1'))
				{
					count += 1;
				}
			}
		//id du compte de points
		$rowCount = $('#count'+rowLetter);
		//affichage HTML (avec un 0 pour les nombres < 10)
		if (count < 10)
		{
			$pointCount = $rowCount.find(".point-count").html('0'+count);
		}
		else
		{
			$pointCount = $rowCount.find(".point-count").html(count);
		}
	};

	/* détection des points par colonne*/
	for (var i = 0; i < columns.length; i++) 
	{
		//récupération du numéro de la colonne
		columnNumber = columns[i];
		var count = 0;
			for (var j = 0; j < rows.length; j++) 
			{
				//id du coffre = rangée-colonne, récupération de l'élément HTML
				rowLetter = rows[j];
				cell = "#"+rowLetter+columnNumber;
				$cell = $(cell);
				//augmentation du compte de points pour chaque coffre non-piégé
				if ($cell.hasClass('x3'))
				{
					count += 3;
				}
				else if ($cell.hasClass('x2'))
				{
					count += 2;
				}
				else if ($cell.hasClass('x1'))
				{
					count += 1;
				}
			}
		//id du compte de points
		$columnCount = $('#count'+columnNumber);
		//affichage HTML (avec un 0 pour les nombres < 10)
		if (count < 10)
		{
			$pointCount = $columnCount.find(".point-count").html('0'+count);
		}
		else
		{
			$pointCount = $columnCount.find(".point-count").html(count);
		}
	};
}

//sélection d'un coffre aléatoire par id
function randomChest() {
	var randomRow = rows[getRandomIntInclusive(0, 4)];
	var randomColumn = columns[getRandomIntInclusive(0, 4)];
	var chestId = "#"+randomRow+randomColumn;
	$chest = $(chestId);
	return $chest;
}

//sélection/désélection d'un indicateur au clic
function select() {
	if ($(this).hasClass('select'))
	{
		($(this).removeClass('select'));
	}
	else
	{
		($(this).addClass('select'));
	}
}

//suppression de tous les indicateurs
function resetSelect() {
	$bombIndic.removeClass('select');
	$x1Indic.removeClass('select');
	$x2Indic.removeClass('select');
	$x3Indic.removeClass('select');
}

//sauvegarde et changement de salle
function saveScore() {
	//transfert des pièces au score total
	TOTALSCORE += CURRENTSCORE;
	CURRENTSCORE = 0;
	//mise à jour de l'affichage HTML
	updateScore();
	//nouvelle salle
	init();
}

//mise à jour de l'affichage HTML
function updateScore() {
	$totalScore.html('Pièces accumulées : '+TOTALSCORE);
	$currentScore.html('Pièces en cours : '+CURRENTSCORE);
	$maxScore.html('Meilleur score : '+MAXSCORE);
}

//ouverture du coffre cliqué
function openChest() {
	//uniquement si le coffre est fermé
	if ($(this).parent().parent().hasClass('closed'))
	{
		//si le coffre est piégé
		if ($(this).parent().parent().hasClass("bomb"))
		{
			//affichage de l'explosion
			$(this).parent().parent().removeClass('closed');
			$(this).parent().parent().addClass('boom');
			//fin de la partie
			gameOver();
			exit();
		}

		//si le coffre contient des pièces
		else
		{
			//affichage du coffre ouvert
			$(this).parent().parent().removeClass('closed');
			$(this).parent().parent().addClass('open');

			//pour les coffres x3
			if ($(this).parent().parent().hasClass("x3"))
			{
				//affichage de la valeur
				$(this).html("x3");
				$(this).css("color", "#e9160e");
				//mise à jour du score
				if (CURRENTSCORE != 0)
				{
					CURRENTSCORE = CURRENTSCORE*3;
				}
				else
				{
					CURRENTSCORE = 3;
				}
			}
			//pour les coffres x2
			else if ($(this).parent().parent().hasClass("x2"))
			{
				//affichage de la valeur
				$(this).html("x2");
				$(this).css("color", "#ecf601");
				//mise à jour du score
				if (CURRENTSCORE != 0)
				{
					CURRENTSCORE = CURRENTSCORE*2;
				}
				else
				{
					CURRENTSCORE = 2;
				}
			}
			//pour les coffres x1
			else if ($(this).parent().parent().hasClass("x1"))
			{
				//affichage de la valeur
				$(this).html("x1");
				$(this).css("color", "black");
				//mise à jour du score
				if (CURRENTSCORE == 0)
				{
					CURRENTSCORE = 1;
				}
			}		
			//mise à jour de l'affichage du score
			updateScore();
		}
	}	

	//victoire s'il n'y a plus aucun coffre x3 ou x2
	var win = true;
	var $closed = $('.closed');
	$closed.each(function() {
		if ($(this).hasClass("x3") || $(this).hasClass("x2"))
		{
			win = false;
		}
	});

	//en cas de victoire
	if (win == true)
	{
		//passage au niveau suivant
		LEVEL++;
		alert("Bravo ! Vous avez récupéré tous les coffres x2 et x3. \n \n Un passage s'ouvre et conduit à un escalier vers l'étage n°"+LEVEL+" !");
		//affichage du contenu de tous les coffres encore fermés
		revealChests();
		//sauvegarde et nouvelle salle après 2 secondes
		showTimer = setTimeout(saveScore, 2000);
		//mise à jour de l'affichage du niveau
		$level.html('Etage n°'+LEVEL);
	}
}

//en cas d'ouverture d'un coffre piégé
function gameOver() {
	//mise à jour du meilleur score le cas échéant
	if (TOTALSCORE > MAXSCORE)
	{
		MAXSCORE = TOTALSCORE;
	}
	//affichage du score en fonction du nombre de pièces et du niveau
	if (TOTALSCORE > 0)
	{
		if (LEVEL > 1)
		{
			alert("Boom ! Vous avez réussi à accumuler "+TOTALSCORE+" pièces avant l'explosion mais vous êtes projetée à l'étage précédent. Votre meilleur score est de "+MAXSCORE+" pièces d'or.");
		}
		else
		{
			alert("Boom ! Vous avez réussi à accumuler "+TOTALSCORE+" pièces avant l'explosion. Votre meilleur score est de "+MAXSCORE+" pièces d'or.");
		}
		
	}
	else
	{
		if (LEVEL > 1)
		{
			alert("Boom ! Vous n'avez réussi à accumuler aucune pièce avant l'explosion et vous êtes projetée à l'étage précédent. Votre meilleur score est de "+MAXSCORE+" pièces d'or.");
		}
		else
		{
			alert("Boom ! Vous n'avez réussi à accumuler aucune pièce avant l'explosion. Votre meilleur score est de "+MAXSCORE+" pièces d'or.");
		}
	}
	//remise à zéro du score et de son affichage
	TOTALSCORE = 0;
	CURRENTSCORE = 0;
	updateScore();
	//affichage du contenu de tous les coffres encore fermés
	revealChests();
	//passage au niveau précédent
	if (LEVEL > 1)
	{
		LEVEL--;
	}
	//mise à jour de l'affichage du niveau
	$level.html('Etage n°'+LEVEL);
	//nouvelle salle après 3 secondes
	showTimer = setTimeout(init, 3000);
}

function revealChests() {
	//affichage du contenu de tous les coffres encore fermés
	$chests.each(function() {
		if ($(this).hasClass('bomb')  && $(this).hasClass('closed'))
		{
			$(this).removeClass('closed');
			$(this).addClass('boom');
		}
		else if ($(this).hasClass('x3') && $(this).hasClass('closed'))
		{
			$(this).removeClass('closed');
			$(this).addClass('open');
			$(this).children().find(".text-content").html("x3");
			$(this).children().find(".text-content").css("color", "#e9160e");
		}
		else if ($(this).hasClass('x2') && $(this).hasClass('closed'))
		{
			$(this).removeClass('closed');
			$(this).addClass('open');
			$(this).children().find(".text-content").html("x2");
			$(this).children().find(".text-content").css("color", "#ecf601");
		}
		else if ($(this).hasClass('x1') && $(this).hasClass('closed'))
		{
			$(this).removeClass('closed');
			$(this).addClass('open');
			$(this).children().find(".text-content").html("x1");
			$(this).children().find(".text-content").css("color", "black");
		}
	});
}