# Stile

Tennis Analyzer è un’app da leggere a bordo campo, non una dashboard sportiva. Il video, i conteggi e i frame sono il contenuto. L’interfaccia resta indietro: fondo azzurro chiaro, poco contrasto tra le superfici, un solo blu.

Queste sono le regole delle schermate già in app.

L’app è solo chiara. La status bar segue il tema di sistema; le schermate no.

## Colori

Usare questi valori così come sono. Non introdurre un secondo colore di marca.

La tinta viene dal blu del campo indoor, `#4C85BF`. Quel valore resta il riferimento: è troppo chiaro per un testo bianco, quindi l’accento dell’interfaccia è lo stesso blu, un gradino più scuro.

| Ruolo | Valore | Dove |
| --- | --- | --- |
| Fondo | `#F1F4F8` | Schermata e radice dell’app |
| Scheda | `#F6F8FB` | Conteggi, colpi, timeline |
| Superficie sollevata | `#FFFFFF` | Riga di un risultato, tab bar, menu |
| Linea | `#D5DEE8` | Bordo delle schede, hairline della tab bar, divisori interni |
| Inchiostro | `#15283F` | Titoli, numeri, corpo del testo |
| Tenue | `#6D7C8E` | Etichette, sottotitoli, tab non selezionato |
| Secondario | `#556678` | Testo di supporto, come la riga dei conteggi |
| Chevron | `#93A0AE` | Freccia di una riga |
| Campo | `#3A6B9C` | Tab attivo, azione primaria, link, dritto |
| Segnaposto | `#DEE5ED` | Thumbnail vuota, avatar senza foto |
| Media | `#111111` | Pozzo del video e dei frame |
| Su media | `#FFFFFF` | Testo sopra video o immagine a tutto schermo |
| Velatura immagine | `rgba(0, 0, 0, 0.92)` | Modale del frame |
| Velatura menu | `rgba(0, 0, 0, 0.35)` | Sfondo di un menu a tendina |
| Errore | `#9C3D32` | Solo messaggi di errore |

`#3A6B9C` è l’unico accento. Un link, il tab selezionato e il pulsante principale lo condividono. Il rovescio non ha un colore proprio: resta un grigio azzurro, così il blu continua a significare “dritto” e “azione”. `#4C85BF` non si usa come riempimento di un controllo.

| Tipo di colpo | Segno | Testo sul segno |
| --- | --- | --- |
| Dritto | `#3A6B9C` | `#FFFFFF` |
| Rovescio | `#8A97A6` | `#FFFFFF` |
| Altro | `#D3DAE2` | `#15283F` |

Le schede quasi si fondono col fondo. Il bordo da 1 px è ciò che le separa. Non alzare il contrasto della scheda per “farla vedere di più”.

La riga di un risultato è l’eccezione: è bianca e ha un’ombra corta, perché è un oggetto che si tocca.

```
shadowColor: #15283F
shadowOffset: 0, 2
shadowOpacity: 0.08
shadowRadius: 8
elevation: 2
```

Niente ombra sulle schede di recap, sui colpi e sulla timeline.

## Tipo

Font di sistema. Nessun font custom.

| Ruolo | Dimensione | Peso | Interlinea | Colore |
| --- | --- | --- | --- | --- |
| Titolo di schermata | 32 | 600 | default | Inchiostro |
| Titolo in header | 22 | 600 | default | Inchiostro |
| Numero | 22 | 500 | default | Inchiostro |
| Corpo | 15 | 400 | 21 | Inchiostro |
| Riga di elenco | 16 | 500 | default | Inchiostro |
| Supporto | 14 | 400 | default | Tenue o secondario |
| Etichetta | 12 | 500 | default | Tenue |
| Micro etichetta | 11 | 600 | default | Tenue |

L’etichetta è maiuscola, con `letterSpacing` 0.8. La micro etichetta, quella dentro la scheda di un colpo, è maiuscola con `letterSpacing` 0.6. Tutto il resto è in sentence case, come in “Previous videos” e “Shot timeline”.

I titoli di schermata stanno a peso 600. Il peso 700 è fuori scala.

## Spazio

La safe area è applicata una volta sola, in `App`. Le schermate non aggiungono un altro inset in alto o in basso.

| Uso | Valore |
| --- | --- |
| Margine orizzontale della schermata | 24 |
| Titolo di una tab, dal bordo alto | 28 |
| Header con freccia indietro, dal bordo alto | 12 |
| Tra titolo e sottotitolo | 8 |
| Tra sottotitolo e contenuto | 20 |
| Tra una scheda e la successiva | 12 |
| Padding di una scheda di conteggio | 16 orizzontale, 14 verticale |
| Padding di timeline e scheda colpo | 16 orizzontale; la scheda colpo può stare a 10 se contiene il frame |
| Padding sotto l’ultimo contenuto in scroll | 24 |

Scala da riusare: 4, 8, 12, 16, 20, 24, 28. Se un valore non è in questa scala, va giustificato dal contenuto, come il frame 90×90.

## Raggi

| Oggetto | Raggio |
| --- | --- |
| Video del colpo | 20 |
| Schede, riga risultato, menu | 18 |
| Pulsante principale, chip tipo “Close” | 16 |
| Thumbnail, frame, immagine del colpo | 12 |
| Avatar | cerchio |

Il raggio 8 non si usa.

## Controlli

Un’azione primaria è piena, `#3A6B9C`, testo bianco a 16 / 600, padding verticale 14, raggio 16, larghezza della schermata. Un solo pulsante primario per schermata.

Un’azione secondaria è testo `#3A6B9C` a 14 / 600, senza riempimento. Esempio: cambiare la foto profilo.

Il pulsante nero (`#111111`) non si usa. Il nero resta il pozzo dei media.

La freccia indietro è un carattere `‹` a 32 / 400, area visiva 32, con `hitSlop` 8. Ogni controllo toccabile copre almeno 44 pt, anche se il disegno è più piccolo.

La tab bar è bianca, con una hairline `#D5DEE8` sopra. Il tab attivo ha un punto da 6 pt `#3A6B9C` e l’etichetta a 14 / 600 nello stesso blu. Il tab inattivo è 14 / 400 tenue, e riserva lo stesso spazio del punto, vuoto, così le etichette non saltano.

## Media

Il player sta in una card 16:9, raggio 20, fondo `#111111`, `resizeMode="contain"`. I frame dei colpi usano lo stesso fondo e lo stesso contain: si vede il fotogramma intero, non un ritaglio. La thumbnail in elenco è l’unica immagine in `cover`, perché è un’anteprima della riga, non il frame di analisi.

Un’immagine aperta dal colpo copre lo schermo con la velatura scura. La chiusura è un chip chiaro traslucido (`rgba(255, 255, 255, 0.18)`), testo bianco 14 / 600.

Se manca la thumbnail, il segnaposto è `#DEE5ED` con un’icona semplice in `#556678`. Niente illustrazioni.

## Icone

Poche, disegnate nel layout o prese da un asset già in repo. La racchetta accanto a un conteggio è 22×28. Non aggiungere un set di icone generiche per abbellire le righe.

## Testo dell’interfaccia

Inglese, corto, concreto. Un’etichetta dice che cosa è il dato: “Forehand”, “Time”, “Comment”. I messaggi di errore dicono che cosa non è successo, in una riga: “Could not play the overlay video.”

Niente punti esclamativi, niente tono da coach, niente maiuscole intere fuori dalle etichette.
