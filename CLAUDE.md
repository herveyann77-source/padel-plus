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
10. **Bilan du tournoi TOUJOURS accessible depuis la fiche d'indemnité** (bouton « 📊 Bilan du tournoi », n°688, fonction indBil).
    Il l'envoie à chaque club avec sa fiche. Avant toute modif de l'Indemnisation, du menu ou de Communication, vérifier que ce chemin marche encore.

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
- Cartes de match (décidé le 19/11, n°677, remplace le style « A2 ») : style « G » dans Padel+ et page joueurs :
  bande à gauche de la COULEUR DE LA POULE (n°689, demande de Yann ; tableau : bleu `#3b6fd8`), en-tête neutre `#f4f6fb`, titre marine ; ligne du vainqueur sur
  léger dégradé jaune (`#fff1c2` → blanc) ; sets gagnés dans une case marine `#26357a` avec chiffre jaune `#ffcf3f` ;
  perdant en gris ; « Q » gris clair ; une fois fini : pas de coupe grise chez le perdant (invisible mais touchable),
  pas de « Piste – ». Coupe du vainqueur = rond blanc, contour or. Vue TV (fond foncé) : garde la bande bleue.
  Yann ne veut pas de bandes foncées pleines (effet damier quand le gagnant change de ligne) ni de couleurs par match.
- Match en cours (n°689/692) : gros contour (5 px) de la couleur de la poule + toute la case teintée très clair de cette couleur
  (en-tête un peu plus foncé), pas de rouge. Validé par Yann. Match prêt (les 2 équipes arrivées,
  4 boutons verts) : il monte en haut à gauche ; ordre dans une poule (n°690) : 1) matchs TERMINÉS dans l'ordre où ils ont fini (en haut à gauche, à droite, 2e ligne…),
  2) match en cours, 3) matchs prêts, 4) les autres ; quand la poule est entièrement finie : ordre normal (fonctions mFin, mRdy).
- Balles neuves (n°694) : sur un match terminé, l'ICÔNE balle 🎾 (pas de texte) reste SEULEMENT si des balles neuves
  ont été données (verte, touchable : S.bal, togBal) ; sinon elle disparaît. Exception à la règle n°680 « plus de balle sur un match fini ».
- Page du tournoi : bouton « 👀 Invité » pour suivre résultats, poules (classement en direct) et tableau sans jouer.
- Fiches équipes : bande « Têtes de série » en haut (si plus de 4 TS : deux vagues, TS 1 à 4 / TS 5 à 8 par défaut,
  chacune avec son heure, glisser une fiche TS d'une vague à l'autre par appui long), trait de séparation, puis bande « Poules ».
- Tirage : TS1 en bas, TS2 en haut, TS3/TS4 tirées au sort ; TS5 et TS6 jamais dans la même moitié ; deux équipes d'une même
  poule ne se rencontrent qu'en finale ; exempts jamais affichés.
- « Matchs de classement » (pas « consolante ») ; pour éliminés en poule : seulement s'il le demande (Non par défaut).
- Cartes de match : coupe devant le vainqueur (toucher = saisie du score), identiques en poules et tableau.
  Match terminé (n°680) : plus de balle ni de flèche ↺ dans l'en-tête ; toucher le titre = fenêtre avec « Reset du match ».
- Page « Envoyer le score » (score.html, n°684) : le joueur touche son équipe, puis « Qui a gagné ? » (coupe), puis un score
  tout fait (9-0 … 9-8 ; 6-0 … 7-6 ; 4-0 … 5-4), comme dans Padel+. Matchs en plusieurs sets : clavier par set (inchangé).
- Noms trop longs (fiches équipes, page joueur, score) : prénom en initiale (« GOURDON-MARTINEZ A. »), jamais sous le nom.
- Mail de convocation : grand bloc bleu marine avec l'heure en très grand, récap (tournoi, lieu + adresse, formule, matchs),
  bouton vert « ✅ Je confirme mon inscription » → joueur.html?c=1 : le joueur touche son nom, la confirmation part seule,
  puis il voit « Comment venir » (Itinéraire, Google Maps, Waze), agenda, équipe, poule avec astérisque (poules indicatives),
  « Bon à savoir ». Pas de numéro de piste annoncé à l'avance (seulement « C'est à toi · Piste N » quand le match est lancé).
- Annonces de tournois : lien d'inscription du club (Mes clubs → « Lien d'inscription des joueurs », jamais pour Lésigny),
  pas de nombre de places (les inscriptions ne passent pas par l'appli). Canaux WhatsApp par catégorie (lien collé une fois).
- Planning tableau (n°700, ordre de Yann) : quarts dans l'ordre (Q1+Q2 ensemble = haut, puis Q3+Q4 = bas) ; un match attend
  seulement SES 2 matchs d'origine (fonction feed) ; à heure égale : quart restant > match de classement > demi-finale ;
  on enchaîne dès qu'une piste se libère.
- Planning : finale + matchs de places (3e, 5e, 7e…) tous à la même heure, après la fin de TOUTES les demies ;
  en P500, demi-finale et finale = créneau d'1 heure (pas 45 min + 1 h).
- Poules + tableau : les perdants d'un tour AVANT les quarts (1/8…) jouent UN SEUL match (perdant n°1 contre n°2,
  n°3 contre n°4…), puis fini (gagnants 9es, perdants 11es) ; perdants des quarts : classement complet (5e, 7e).
  Un match de classement attend seulement les 2 matchs d'où viennent ses perdants (n°700).
- Planning : déjà refait avec Yann (frise + grille), il en est plutôt content ; à revoir seulement à la marge.
  Grille (n°695) : colonne de gauche = heure du départ sur la 1re ligne, puis « suivi de » (jamais une heure commune
  à toute la ligne) ; chaque case garde son heure réelle (« commencé 10:04 ») ou prévue.
- En-tête du tournoi (n°699) : titre « P500 Messieurs » + club · date centré, sur la même ligne que Retour.
- Cloud (n°699) : « Conflit cloud » faux positif quand le réseau est faible (envoi arrivé, réponse perdue) → corrigé
  (SB.sent : rev + heure de l'envoi, vérifiés avant de crier au conflit). Ne jamais lui faire toucher « Récupérer » en tournoi.
- Barème des points (n°700) : toute la colonne du tournoi en jaune + « ⭐ ton tournoi ».
- Couleurs : bleu marine `#141c4a` / `#101d5a` et vert balle `#b6ef2a`. Logo « Le smash ».
- Il utilise Padel+ uniquement sur iPad (iPad Air 13").

## Idées du 12 novembre à mettre en place à partir du lundi 16/11 (dans cet ordre, image d'abord)
1. ✅ FAIT le 19/11 (n°679, page joueur, fonction placeCard) — **« Ta place dans le tournoi »** (page joueur + Padel+ Joueur) : cadre violet style B ; rang en très grand
   (« 10e sur 24 équipes inscrites »), pastille TS ou « Poule B · 2e de poule », liste de toutes les équipes
   (TS, trait, puis les autres), équipe du joueur surlignée en jaune avec « Toi », « toucher pour tout voir ».
   Dessin déjà validé dans le principe (ta-place.png), à installer après accord.
2. **Padel+ Joueur** — CAHIER DES CHARGES DE YANN : minimum de clics, maximum d'informations, ultra lisible,
   d'une simplicité déconcertante ; il laisse Claude libre d'utiliser tous ses outils (skills de design, Supabase,
   photos) : bon code couleur, animations « magiques » discrètes, quelque chose de vraiment génial. (voir plus bas) : mémorable, appli favorite, photos Unsplash, connexion licence + code.
3. ✅ TV FAIT le 19/11 (n°680, bandeau toutes les 70 s, tvQuizTick) — **Question du jour** : les 255 questions FFT dans Padel+ Joueur (et sur la Vue TV), réponse + source citée.
4. ✅ FAIT (clos le 19/11 avec Yann : ▲▼ n°673, question n°680, chiffre du tournoi déjà là ; panneau « Prochains matchs » retiré de la TV à sa demande, remplacé par les notifications ; vidéos d’ambiance abandonnées) — **Vue TV vivante** : Yann ne filmera JAMAIS de points → abandon du « point du jour » filmé (ne plus le proposer).
   Garder : flèches ▲▼ dans les classements de poule (n'existent que dans le Défi), bandeau « ❓ question d'arbitrage,
   réponse dans 8 s » (255 questions FFT), « le chiffre du tournoi » (existe déjà : défilé + page Stats). Panneau de droite à repenser : « Prochains matchs /
   C'est à vous · Piste N » et/ou courts clips d'ambiance gratuits (Pexels, domaine à autoriser). Maquette de départ :
   maquettes/vue-tv-vivante.png (sans la vidéo filmée).
4b. **« Ce qu'il te faut pour te qualifier »** (appli joueurs seulement, idée du 12/11) : avant le dernier match de
   poule, dire au joueur le score nécessaire (ex. « gagne 9-0 : qualifié ; 9-1 : éliminé »), calculé selon les
   règles de départage (points, diff. de sets, diff. de jeux, confrontation directe). EXISTE DÉJÀ dans joueur.html (fonction qualCard).
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
- ✅ Notifications ACTIVÉES le 19/11 (n°686) : « 🎾 C'est à toi ! » part aux 4 joueurs quand Yann touche ▶ Lancer
  (texte modifiable dans Paramètres › Padel+ Joueur). Depuis n°691 : numéro de piste AJOUTÉ par défaut
  (Yann choisit la piste en lançant) → « Rends-toi sur la piste 3. » ; il peut remettre Non. Rappel la veille à 18h avec l'heure de CONVOCATION (jamais l'heure d'un match).
  Le joueur active dans Padel+ Joueur › Moi › « 🔔 Me prévenir » (iPhone : ajouter d'abord à l'écran d'accueil).
  Supabase : padel_push, padel_push_cfg (privée), padel_push_sub, fonction padel-push, cron 'padel-veille'.
- RÈGLE : JAMAIS l'heure d'un match visible avant le jour du tournoi (n°685 : liveData n'envoie pas « h » avant, pages joueurs l'effacent).
- En attente de lui : bouton magique Moja (réponse du comité), inscriptions en ligne, appli App Store.

## Ajouts du 23-24/11 (n°702-703)
- n°702 : ouverture rapide (sw.js : si le réseau ne répond pas en 3 s, la copie locale s'ouvre) ; Tournois : un seul bouton « Tout déplier / Tout plier » ;
  barème des points en un seul exemplaire ; Règlement FFT aligné sur le guide 2027 (chapitre III, juillet 2026) : P3000 = 8 semaines, plus aucune mention « guide 2026 ».
- n°703 : 🎙️ **Dicter** (bouton à côté de ⚡ Actions dans Poules et Tableau, fonctions dictGo/dictUnderstand/dictOk) : simple CHOIX, la saisie habituelle reste ;
  rien n'est enregistré sans ✓ ; si plusieurs matchs possibles, le match « en cours » est préféré, sinon il propose la liste.
- n°703 : **matchs en plusieurs sets** (décision de Yann) : chaque set pareil, « qui a gagné le set ? » puis le score, sets les uns sous les autres
  (bigSetsHtml, bigSW, bigSS) ; super tie-break / 3e set seulement à 1 set partout ; enregistrement automatique dès que le match est gagné.
  La coupe pré-choisit le vainqueur de chaque set (modifiable). Les formats en 1 set ne changent pas.
- n°703 : vidéos d'aide joueurs dans `aide/` (confirmer-inscription.mp4, 19 s), bouton « 🎬 Comment faire ? » dans joueur.html (vidOpen) et lien dans le mail d'annonce Padel+ Joueur.
  À faire ensuite (même style) : « Envoyer mon score », « Suivre le tournoi en direct ».
- n°703 : correction du classement final : une équipe battue seule au 1er tour du tableau (ex. une seule 1/8) n'avait pas de place → place suivante.
- **Banc d'essai** : `banc-essai/` (banc.js injecté dans index.html + run.py Playwright) joue ~1 430 formules × 2 (favoris / hasard) et vérifie
  poules, classement final, onglets. À lancer avant les grosses modifications. Reste connu (à voir avec Yann) : dans quelques formules rares
  (q=2 avec des poules impaires), deux équipes d'une même poule peuvent se croiser avant la finale.
