// TODO: 2. Die Animation für DEAD des Characters verbessern --> Aktuell Character immer noch angezeigt. Kann laufen. Spiel muss beendeet werden.

// 21 - Aufgaben:
// TODO: 4. Musik im Hintergrund und bei Aktionen.
// TODO: 5. Coins einsammeln.
// TODO: 6. Flaschen einsammeln.
// TODO: 7. Flaschen nur werfen, wenn sie vorhanden sind.
// TODO: 8. Collison der Flaschen mit kleinen und großen Enemies. --> TODO: Eventuell kann man auf die Gegner sprignen.
// TODO: 9. Endgegner besiegen. --> Er hat auch ne Energie. Z.b. wenn er 3x getroffen wird, wird er tod sein.
// TODO: 10. Game-Over Screen, wenn das Spiel zu Ende (Character Tod, Endgegner besiegt (Level zu Ende)).
// TODO: 11. Fullscreean Modus via Fullscreen Icon rechts unten im Canvas --> via canvas.requestFullscreen()
// TODO: 12. Erklärung der Tasten Steuerung unter Canvas: Up, Right, Left, Space ...
// TODO: 13. Rahmen entwerfen.
// TODO: 14. Geschwindigkeiten anpassen (FPS). Lauf soll flüssig sein. Flasche soll schnelle z.B. fliegen.
// TODO: 15. Eine Klasse auch für Layer Screen, Btns machen, damit nur game.js die Sachen initialisiert, ähnlich wie Program.cs bei C#.

// Anforderungn aus dem VORletzten Video "Wie sauberer Code aussehen sollte"
// TODO: 16./16.1 Die Methoden sollen nicht länger als 14 Zeilen sein.
// TODO: 16.2. In Bezug auf 16 z.B bei Arrow Function () => {this.BespielFunktionOderMethoder()} nur aus einer Zeile bestehen, können die {} gelöscht werden, da nicht weitere Statements danach ausgeüfhrt werden --> Kürzung des Codes der Arrow-Fn.
// TODO: 16.3  If Conditions in eine separate return Funktion auslagern und den Namen als eine Frage geben, z.B. canMoveRight() {return .....}.
// TODO: 16.4  Den Funktionsblock z.B der IfAbfrage canMoveRight() bei der Character Klasse in eine separate moveRight() auslagern. Wenn diese separate Fn auch eine Fn mit dem gleichen Namen ausführt, d.h. z.B. moveRight() führt eine moveRight() aus der vererbenden SuperKlasse movableObject.class.js aus, dann ist diese geerbte Fn, hier moveRight(), mittels super.moveRight() (zur Differeniezrung / "Kollision" bei gleicher FunktionsNamensGebung / Fehlervermeidung) innnerhalb der separaten Fn moveRight() auszuführen.
// TODO: 16.5  Die IfAbfrage kann auch auf eine Zeile ohne {} Klammern verkürzt werden, wenn nur ein Statement im IfAbfrageBlock vorhanden ist.
// TODO: 17.. FINACL CHECK / ES SOLL "PERFEKT": PORTFOLIO-READY SEIN!
// TODO: 18. Preload Funktion, dass zuerst alle Bilder geladen werden, nicht dass schwarzes Canvas mit Rechteckecken animiert wird.
// TODO: Rausfinden, woran der schwarze Bild lange bleibt. Vielleicht füllen von allen ImageCaces mit loadImages(). (Idee) Vielleicht als All Promises machen, erst weiter wenn alle Promises von loadImages abgeschlossen.
// TODO: 19. Sich die AudioPlayStop Funktionen damals von TicTacToe anschauen nehmen, hatte keine Probleme für Promises
// TODO: 20. Statusbar Character
// TODO: 21. Character soll auf Endboss springen können (bei Pressing berücksichtigen
// TODO: 22. Musik nehmen hintergrund
// TODO: 23. Alle Audio sollen in Array und stoppbar sein, wenn Spiel zu Ende
// TODO: 24. Health überall anpassen als Vielfachen von 5, da hit -5, endboss 25, normalCHicken 10, small = 5;, bottel, Coin
// TODO: 25. Initialisierungfunktion von Bottle und Coins im Array
// TODO: 26. Verschiedene Farbe für statusbars
