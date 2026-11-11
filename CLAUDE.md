# Padel+ — carnet de règles (à lire en entier avant toute modification)

Appli web de Yann Hervé, juge-arbitre de padel (JAP2) et professeur de tennis/padel.
Il travaille **uniquement sur iPad** (pas d'ordinateur), en français, en débutant en informatique.
Réponses : en français, courtes, un geste à la fois, comme « à un enfant de 5 ans ».

## Règles absolues
1. **Toujours repartir de la version publiée sur GitHub** (ce dépôt, branche main), jamais d'une ancienne copie.
2. **Montrer d'abord une image** (capture réelle ou dessin) de tout changement d'affichage, attendre son accord, puis installer.
3. **Rien de payant.** Si quelque chose coûte de l'argent, donner le prix et y renoncer.
4. **Lésigny** (USC Lésigny) ne doit **jamais** apparaître côté joueurs (mails, pages joueurs, live, TV, annonces).
   Seule exception : la rubrique Indemnisation (fiche d'indemnité et bilan envoyés au club). Sinon : STOP rouge et lui demander.
5. **Vérifier que l'idée n'existe pas déjà** dans le code avant de la proposer (grep dans index.html et les pages joueurs).
6. Prénom **toujours à côté** du nom (jamais dessous). Nom en MAJUSCULES, prénom avec majuscule initiale.
7. Mails aux joueurs : **toujours en copie cachée (Cci)** + mention RGPD.
8. Appli épurée : regrouper le secondaire derrière « ⚡ Actions », proposer régulièrement des épurations franches.
9. Il veut des améliorations faites directement (pas besoin de redemander pour chaque petite correction),
   mais **ne jamais publier sans son feu vert** sur la version à publier.

## Fichiers
- `index.html` : l'appli du juge-arbitre (≈1,2 Mo, tout-en-un). Version affichée : `Version 2 · n°XXX`.
- `sw.js` : service worker, cache `padelplus-XXX` (réseau d'abord). **Changer le numéro aux deux endroits à chaque version.**
- Pages joueurs (liées par Supabase) : `joueur.html` (« Mon tournoi » : confirmation, convocation, poule, live),
  `confirmer.html`, `score.html` (score saisi depuis la piste, validé si les 2 équipes concordent),
  `stats.html` (statistiques perso), `live.html`, `arena.html` (jeux/pronostics).
- `.nojekyll` : **ne pas supprimer** (évite les échecs de publication GitHub Pages).
- Les anciennes copies `index 2..5.html` ont été supprimées le 12/11 avec son accord (récupérables dans l'historique GitHub).
- Cloud : Supabase `https://nikfwvmrrytshvlrgqae.supabase.co`. Site : `https://herveyann77-source.github.io/padel-plus/`.

## Publier une version
1. Modifier, changer `n°XXX` dans index.html et sw.js.
2. Vérifier la syntaxe des scripts (`node --check` sur chaque bloc `<script>`, sauf le JSON des 255 questions).
3. Tester dans Chrome headless (Playwright, `/usr/bin/google-chrome`) : ouvrir index.html, cliquer « Préparer un tournoi »,
   puis `S.fmt="PT";S.n=24;S.p=4;S.q=2;S.nts=8;demo();save();inT=true;go('Équipes');sub='fiches';render()`, faire une capture.
4. Montrer la capture à Yann, attendre son accord, commit + push sur main.
5. Vérifier le ✓ vert de « pages build and deployment », puis que le site en ligne affiche le bon numéro.
6. Lui dire : fermer complètement Padel+ et la rouvrir.

## Décisions déjà prises (ne pas reproposer autrement)
- Fiches équipes : bande « Têtes de série » en haut (si plus de 4 TS : deux vagues, TS 1 à 4 / TS 5 à 8 par défaut,
  chacune avec son heure, glisser une fiche TS d'une vague à l'autre par appui long), trait de séparation, puis bande « Poules ».
- Tirage : TS1 en bas, TS2 en haut, TS3/TS4 tirées au sort ; TS5 et TS6 jamais dans la même moitié ; deux équipes d'une même
  poule ne se rencontrent qu'en finale ; exempts jamais affichés.
- « Matchs de classement » (pas « consolante ») ; pour éliminés en poule : seulement s'il le demande (Non par défaut).
- Cartes de match : coupe devant le vainqueur (toucher = saisie du score), identiques en poules et tableau.
- Mail de convocation : grand bloc bleu marine avec l'heure en très grand, récap (tournoi, lieu + adresse, formule, matchs),
  bouton vert « ✅ Je confirme mon inscription » → joueur.html?c=1 : le joueur touche son nom, la confirmation part seule,
  puis il voit « Comment venir » (Itinéraire, Google Maps, Waze), agenda, équipe, poule avec astérisque (poules indicatives),
  « Bon à savoir ». Pas de numéro de piste annoncé à l'avance (seulement « C'est à toi · Piste N » quand le match est lancé).
- Annonces de tournois : lien d'inscription du club (Mes clubs → « Lien d'inscription des joueurs », jamais pour Lésigny),
  pas de nombre de places (les inscriptions ne passent pas par l'appli). Canaux WhatsApp par catégorie (lien collé une fois).
- Planning : déjà refait avec Yann (frise + grille), il en est plutôt content ; à revoir seulement à la marge.
- Couleurs : bleu marine `#141c4a` / `#101d5a` et vert balle `#b6ef2a`. Logo « Le smash ».
- Il utilise Padel+ uniquement sur iPad (iPad Air 13").

## Idées du 12 novembre à mettre en place à partir du lundi 16/11 (dans cet ordre, image d'abord)
1. **« Ta place dans le tournoi »** (page joueur + Padel+ Joueur) : cadre violet style B ; rang en très grand
   (« 10e sur 24 équipes inscrites »), pastille TS ou « Poule B · 2e de poule », liste de toutes les équipes
   (TS, trait, puis les autres), équipe du joueur surlignée en jaune avec « Toi », « toucher pour tout voir ».
   Dessin déjà validé dans le principe (ta-place.png), à installer après accord.
2. **Padel+ Joueur** — CAHIER DES CHARGES DE YANN : minimum de clics, maximum d'informations, ultra lisible,
   d'une simplicité déconcertante ; il laisse Claude libre d'utiliser tous ses outils (skills de design, Supabase,
   photos) : bon code couleur, animations « magiques » discrètes, quelque chose de vraiment génial. (voir plus bas) : mémorable, appli favorite, photos Unsplash, connexion licence + code.
3. **Question du jour** : les 255 questions FFT dans Padel+ Joueur (et sur la Vue TV), réponse + source citée.
4. **Vue TV vivante** : « 🔥 Le point du jour » = courtes vidéos filmées par Yann à l'iPad pendant le tournoi
   (accord des joueurs filmés, droit à l'image/RGPD), stockées dans Supabase Storage (gratuit) ;
   ambiance avec clips gratuits Pexels (domaine à autoriser) ; pas de téléchargement de vidéos officielles
   (seulement intégration YouTube autorisée) ; pastilles de 10 s entre les vidéos : question d'arbitrage
   avec compte à rebours, « le chiffre du tournoi » (plus long jeu, score le plus serré…).
   Maquette proposée le 12/11 (maquettes/vue-tv-vivante.png) : à gauche le contenu qui tourne (poules en direct…),
   à droite « 🔥 Le point du jour » en vidéo en boucle sans le son, en bas un bandeau vert balle « ❓ question
   d'arbitrage, réponse dans 8 s ». **Flèches ▲▼ dans les classements de poule** (équipe qui monte/descend après
   un match ; existent déjà seulement dans le Défi). Les questions viennent des 255 FFT (pas inventées).
4b. **« Ce qu'il te faut pour te qualifier »** (appli joueurs seulement, idée du 12/11) : avant le dernier match de
   poule, dire au joueur le score nécessaire (ex. « gagne 9-0 : qualifié ; 9-1 : éliminé »), calculé selon les
   règles de départage (points, diff. de sets, diff. de jeux, confrontation directe). N'existe pas encore.
5. **Photos et vidéos gratuites** partout où ça embellit (Padel+, Padel+ Joueur, Padel+ Club), jamais payant.
7. **Lien Moja / inscriptions des clubs (idée du 12/11)** : rêve = quand un joueur s'inscrit sur le lien du club,
   l'inscription arrive aussi dans Padel+ sans aucune manipulation en plus pour le joueur ; et un lien avec Moja.
   À étudier : quel site d'inscription utilise chaque club (Coquelicot, Aldea, Carré Padel, Ozoir), possibilités
   d'export/notification par mail ; Moja = bouton magique toujours en attente de l'accord du comité.
6. **Padel+ Club** (propriétaires) : plus tard, relié au même Supabase.
- Le connecteur **Supabase** est branché depuis le 12/11 (projet Padel-plus, nikfwvmrrytshvlrgqae) :
  travailler directement dedans (lire librement ; avant toute modification, expliquer à Yann).

## En attente / à venir
- **Padel+ Joueur** (TRÈS IMPORTANT : mémorable, si facile d'accès qu'elle devient l'appli favorite des joueurs) : appli des joueurs (une icône sur l'écran d'accueil, entrée perso licence + code à 4 chiffres choisi
  la 1re fois, mail de bienvenue avec mode d'emploi). Accueil : 4 grandes tuiles avec vraies photos (Unsplash, licence gratuite)
  façon cartes « Aujourd'hui » de l'App Store : Moi, Mon prochain tournoi, Calendrier Padel+, Mes statistiques
  + bandeau « EN DIRECT » le jour J. Défi et Jeux mis de côté. Idées : photo de profil (comme WhatsApp), barème de points
  du tournoi, tutos tactiques/exercices, question du jour (255 questions FFT, citer la source).
- Notifications « C'est l'heure de ton match » (web push gratuit + Supabase), quand on attaquera Padel+ Joueur.
- En attente de lui : bouton magique Moja (réponse du comité), inscriptions en ligne, appli App Store.
