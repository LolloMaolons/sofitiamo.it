<?php
// Imposta l'header per indicare che la risposta è testo semplice, utile per il debug
header('Content-Type: text/plain; charset=utf-8');

// --- SCRIPT PER GENERARE AUTOMATICAMENTE media-list.json ---

// 1. Definisci il percorso della cartella che contiene le foto e i video.
$mediaDirectory = 'media';
// Definisci dove salvare il file JSON generato (all'interno della cartella 'media').
$outputFile = $mediaDirectory . '/media-list.json';

// 2. Controlla se la cartella 'media' esiste.
if (!is_dir($mediaDirectory)) {
    die("ERRORE: La cartella '{$mediaDirectory}' non esiste. Creala e mettici dentro i tuoi file media.");
}

// 3. Scansiona il contenuto della cartella.
$files = scandir($mediaDirectory);

// 4. Prepara un array vuoto per contenere solo i nomi dei file che ci interessano.
$mediaFiles = [];

// 5. Definisci una lista di estensioni di file valide (immagini e video).
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov', 'webm'];

// 6. Itera su ogni file trovato nella cartella.
foreach ($files as $file) {
    // Ignora i riferimenti speciali '.' e '..' che rappresentano la cartella stessa e quella superiore.
    if ($file === '.' || $file === '..') {
        continue;
    }

    // Estrai l'estensione del file e convertila in minuscolo per un controllo uniforme.
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));

    // Se l'estensione del file è presente nella nostra lista di estensioni valide...
    if (in_array($extension, $allowedExtensions)) {
        // ...aggiungi il nome del file al nostro array.
        $mediaFiles[] = $file;
    }
}

// 7. Crea la struttura dati che verrà convertita in JSON.
$jsonData = [
    'files' => $mediaFiles
];

// 8. Converte l'array PHP in una stringa JSON ben formattata (per leggibilità).
$jsonString = json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

// 9. Scrive la stringa JSON nel file 'media-list.json'.
//    La funzione file_put_contents crea il file se non esiste o lo sovrascrive se esiste già.
if (file_put_contents($outputFile, $jsonString)) {
    echo "SUCCESSO!\n\n";
    echo "Il file '{$outputFile}' è stato creato/aggiornato con successo.\n";
    echo "Sono stati trovati e aggiunti " . count($mediaFiles) . " file multimediali.\n\n";
    echo "===================================================================\n";
    echo "IMPORTANTE: Ora puoi e devi cancellare questo script (create-media-list.php) dal server per motivi di sicurezza.\n";
    echo "===================================================================\n";
} else {
    echo "ERRORE!\n\n";
    echo "Non è stato possibile scrivere il file '{$outputFile}'.\n";
    echo "Verifica che il server web abbia i permessi di scrittura per la cartella '{$mediaDirectory}'.\n";
}

?>