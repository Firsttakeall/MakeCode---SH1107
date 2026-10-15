namespace SH1107 {

    const CS = DigitalPin.P16
    const DC = DigitalPin.P2
    const RST = DigitalPin.P12

    const WIDTH = 128
    const HEIGHT = 64

    const PAGES = 16
    const COLS = 64

    const MIROIR_HORIZONTAL = false
    const MIROIR_VERTICAL = false

    let initialized = false
    let buffer = pins.createBuffer(PAGES * COLS)

    const FONT: number[] = [
        0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x5F, 0x00, 0x00,
        0x00, 0x07, 0x00, 0x07, 0x00,
        0x14, 0x7F, 0x14, 0x7F, 0x14,
        0x24, 0x2A, 0x7F, 0x2A, 0x12,
        0x23, 0x13, 0x08, 0x64, 0x62,
        0x36, 0x49, 0x55, 0x22, 0x50,
        0x00, 0x05, 0x03, 0x00, 0x00,
        0x00, 0x1C, 0x22, 0x41, 0x00,
        0x00, 0x41, 0x22, 0x1C, 0x00,
        0x14, 0x08, 0x3E, 0x08, 0x14,
        0x08, 0x08, 0x3E, 0x08, 0x08,
        0x00, 0x50, 0x30, 0x00, 0x00,
        0x08, 0x08, 0x08, 0x08, 0x08,
        0x00, 0x60, 0x60, 0x00, 0x00,
        0x20, 0x10, 0x08, 0x04, 0x02,
        0x3E, 0x51, 0x49, 0x45, 0x3E,
        0x00, 0x42, 0x7F, 0x40, 0x00,
        0x42, 0x61, 0x51, 0x49, 0x46,
        0x21, 0x41, 0x45, 0x4B, 0x31,
        0x18, 0x14, 0x12, 0x7F, 0x10,
        0x27, 0x45, 0x45, 0x45, 0x39,
        0x3C, 0x4A, 0x49, 0x49, 0x30,
        0x01, 0x71, 0x09, 0x05, 0x03,
        0x36, 0x49, 0x49, 0x49, 0x36,
        0x06, 0x49, 0x49, 0x29, 0x1E,
        0x00, 0x36, 0x36, 0x00, 0x00,
        0x00, 0x56, 0x36, 0x00, 0x00,
        0x08, 0x14, 0x22, 0x41, 0x00,
        0x14, 0x14, 0x14, 0x14, 0x14,
        0x00, 0x41, 0x22, 0x14, 0x08,
        0x02, 0x01, 0x51, 0x09, 0x06,
        0x32, 0x49, 0x79, 0x41, 0x3E,
        0x7E, 0x11, 0x11, 0x11, 0x7E,
        0x7F, 0x49, 0x49, 0x49, 0x36,
        0x3E, 0x41, 0x41, 0x41, 0x22,
        0x7F, 0x41, 0x41, 0x22, 0x1C,
        0x7F, 0x49, 0x49, 0x49, 0x41,
        0x7F, 0x09, 0x09, 0x09, 0x01,
        0x3E, 0x41, 0x49, 0x49, 0x7A,
        0x7F, 0x08, 0x08, 0x08, 0x7F,
        0x00, 0x41, 0x7F, 0x41, 0x00,
        0x20, 0x40, 0x41, 0x3F, 0x01,
        0x7F, 0x08, 0x14, 0x22, 0x41,
        0x7F, 0x40, 0x40, 0x40, 0x40,
        0x7F, 0x02, 0x0C, 0x02, 0x7F,
        0x7F, 0x04, 0x08, 0x10, 0x7F,
        0x3E, 0x41, 0x41, 0x41, 0x3E,
        0x7F, 0x09, 0x09, 0x09, 0x06,
        0x3E, 0x41, 0x51, 0x21, 0x5E,
        0x7F, 0x09, 0x19, 0x29, 0x46,
        0x46, 0x49, 0x49, 0x49, 0x31,
        0x01, 0x01, 0x7F, 0x01, 0x01,
        0x3F, 0x40, 0x40, 0x40, 0x3F,
        0x1F, 0x20, 0x40, 0x20, 0x1F,
        0x3F, 0x40, 0x38, 0x40, 0x3F,
        0x63, 0x14, 0x08, 0x14, 0x63,
        0x07, 0x08, 0x70, 0x08, 0x07,
        0x61, 0x51, 0x49, 0x45, 0x43,
        0x00, 0x7F, 0x41, 0x41, 0x00,
        0x02, 0x04, 0x08, 0x10, 0x20,
        0x00, 0x41, 0x41, 0x7F, 0x00,
        0x04, 0x02, 0x01, 0x02, 0x04,
        0x40, 0x40, 0x40, 0x40, 0x40,
        0x00, 0x01, 0x02, 0x04, 0x00,
        0x20, 0x54, 0x54, 0x54, 0x78,
        0x7F, 0x48, 0x44, 0x44, 0x38,
        0x38, 0x44, 0x44, 0x44, 0x20,
        0x38, 0x44, 0x44, 0x48, 0x7F,
        0x38, 0x54, 0x54, 0x54, 0x18,
        0x08, 0x7E, 0x09, 0x01, 0x02,
        0x08, 0x14, 0x54, 0x54, 0x3C,
        0x7F, 0x08, 0x04, 0x04, 0x78,
        0x00, 0x44, 0x7D, 0x40, 0x00,
        0x20, 0x40, 0x44, 0x3D, 0x00,
        0x00, 0x7F, 0x10, 0x28, 0x44,
        0x00, 0x41, 0x7F, 0x40, 0x00,
        0x7C, 0x04, 0x18, 0x04, 0x78,
        0x7C, 0x08, 0x04, 0x04, 0x78,
        0x38, 0x44, 0x44, 0x44, 0x38,
        0x7C, 0x14, 0x14, 0x14, 0x08,
        0x08, 0x14, 0x14, 0x18, 0x7C,
        0x7C, 0x08, 0x04, 0x04, 0x08,
        0x48, 0x54, 0x54, 0x54, 0x20,
        0x04, 0x3F, 0x44, 0x40, 0x20,
        0x3C, 0x40, 0x40, 0x20, 0x7C,
        0x1C, 0x20, 0x40, 0x20, 0x1C,
        0x3C, 0x40, 0x30, 0x40, 0x3C,
        0x44, 0x28, 0x10, 0x28, 0x44,
        0x0C, 0x50, 0x50, 0x50, 0x3C,
        0x44, 0x64, 0x54, 0x4C, 0x44,
        0x00, 0x08, 0x36, 0x41, 0x00,
        0x00, 0x00, 0x7F, 0x00, 0x00,
        0x00, 0x41, 0x36, 0x08, 0x00,
        0x10, 0x08, 0x08, 0x10, 0x08
    ]

    function sendCommand(value: number): void {
        pins.digitalWritePin(CS, 0)
        pins.digitalWritePin(DC, 0)
        pins.spiWrite(value)
        pins.digitalWritePin(CS, 1)
    }

    function sendPair(command: number, value: number): void {
        sendCommand(command)
        sendCommand(value)
    }

    function rafraichirOctet(index: number): void {
        const page = Math.idiv(index, COLS)
        const col = index % COLS
        sendCommand(0xB0 + page)
        sendCommand(col & 0x0F)
        sendCommand(0x10 | (col >> 4))
        pins.digitalWritePin(CS, 0)
        pins.digitalWritePin(DC, 1)
        pins.spiWrite(buffer.getUint8(index))
        pins.digitalWritePin(CS, 1)
    }

    function rafraichir(): void {
        for (let page = 0; page < PAGES; page++) {
            sendCommand(0xB0 + page)
            sendCommand(0x00)
            sendCommand(0x10)
            pins.digitalWritePin(CS, 0)
            pins.digitalWritePin(DC, 1)
            for (let c = 0; c < COLS; c++) {
                pins.spiWrite(buffer.getUint8(page * COLS + c))
            }
            pins.digitalWritePin(CS, 1)
        }
    }

    function setPixel(x: number, y: number, allume: boolean = true): number {
        if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
            return -1
        }
        if (MIROIR_HORIZONTAL) {
            x = WIDTH - 1 - x
        }
        if (MIROIR_VERTICAL) {
            y = HEIGHT - 1 - y
        }
        const ligne = WIDTH - 1 - x
        const colonne = y
        const index = (ligne >> 3) * COLS + colonne
        const masque = 1 << (ligne & 7)
        const actuel = buffer.getUint8(index)
        buffer.setUint8(index, allume ? (actuel | masque) : (actuel & ~masque))
        return index
    }

    function dessinerCaractere(code: number, x: number, y: number, taille: number): void {
        if (code < 32 || code > 126) {
            code = 63
        }
        const base = (code - 32) * 5
        for (let col = 0; col < 5; col++) {
            const bits = FONT[base + col]
            for (let lig = 0; lig < 7; lig++) {
                if ((bits >> lig) & 1) {
                    for (let dx = 0; dx < taille; dx++) {
                        for (let dy = 0; dy < taille; dy++) {
                            setPixel(x + col * taille + dx, y + lig * taille + dy)
                        }
                    }
                }
            }
        }
    }

    function sansAccent(code: number): number {
        const accents = "àâäéèêëîïôöùûüç"
        const simples = "aaaeeeeiioouuuc"
        const i = accents.indexOf(String.fromCharCode(code))
        if (i >= 0) {
            return simples.charCodeAt(i)
        }
        return code
    }

    function dessinerTexte(texte: string, x0: number, y0: number, taille: number): void {
        let x = x0
        let y = y0
        const largeurCar = 6 * taille
        const hauteurLigne = 8 * taille
        for (let i = 0; i < texte.length; i++) {
            const code = sansAccent(texte.charCodeAt(i))
            if (code == 10) {
                x = x0
                y += hauteurLigne
                continue
            }
            if (x + 5 * taille > WIDTH) {
                x = x0
                y += hauteurLigne
            }
            dessinerCaractere(code, x, y, taille)
            x += largeurCar
        }
    }

    //% block="Allumer pixel x %x y %y"
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0
    export function allumerPixel(x: number, y: number): void {
        if (!initialized) {
            return
        }
        const index = setPixel(x, y, true)
        if (index >= 0) {
            rafraichirOctet(index)
        }
    }

    //% block="Éteindre pixel x %x y %y"
    //% x.min=0 x.max=127 x.defl=0
    //% y.min=0 y.max=63 y.defl=0
    export function eteindrePixel(x: number, y: number): void {
        if (!initialized) {
            return
        }
        const index = setPixel(x, y, false)
        if (index >= 0) {
            rafraichirOctet(index)
        }
    }

    //% block="Initialiser OLED"
    export function initialiserOLED(): void {
        pins.spiPins(
            DigitalPin.P15,
            DigitalPin.P14,
            DigitalPin.P13
        )
        pins.spiFormat(8, 3)
        pins.spiFrequency(1000000)
        pins.digitalWritePin(CS, 1)
        pins.digitalWritePin(DC, 1)
        pins.digitalWritePin(RST, 0)
        basic.pause(50)
        pins.digitalWritePin(RST, 1)
        basic.pause(100)
        sendCommand(0xAE)
        sendCommand(0x20)
        sendPair(0xA8, 0x7F)
        sendPair(0xD3, 0x60)
        sendPair(0xDC, 0x00)
        sendPair(0xAD, 0x8A)
        sendPair(0xD5, 0x50)
        sendPair(0xD9, 0x22)
        sendPair(0xDB, 0x35)
        sendCommand(0xA0)
        sendCommand(0xC0)
        sendPair(0x81, 0x4F)
        sendCommand(0xA4)
        sendCommand(0xA6)
        sendCommand(0xAF)
        basic.pause(100)
        initialized = true
        effacerOLED()
    }

    //% block="Effacer OLED"
    export function effacerOLED(): void {
        if (!initialized) {
            return
        }
        buffer.fill(0)
        rafraichir()
    }

    //% block="Afficher texte %texte"
    //% texte.defl="Bonjour"
    export function afficherTexte(texte: string): void {
        if (!initialized) {
            return
        }
        buffer.fill(0)
        dessinerTexte(texte, 0, 0, 1)
        rafraichir()
    }

    //% block="Afficher texte %texte à x %x y %y taille %taille"
    //% texte.defl="Bonjour"
    //% x.defl=0 y.defl=0
    //% taille.min=1 taille.max=4 taille.defl=1
    export function afficherTexteEn(texte: string, x: number, y: number, taille: number): void {
        if (!initialized) {
            return
        }
        buffer.fill(0)
        dessinerTexte(texte, x, y, Math.max(1, Math.min(4, taille)))
        rafraichir()
    }

    //% block="Vider le tampon"
    export function effacerTampon(): void {
        buffer.fill(0)
    }

    //% block="Envoyer le tampon à l'écran"
    export function afficher(): void {
        if (!initialized) {
            return
        }
        rafraichir()
    }

    //% block="Écrire texte %texte à x %x y %y taille %taille"
    //% texte.defl="Bonjour"
    //% x.defl=0 y.defl=0
    //% taille.min=1 taille.max=4 taille.defl=1
    export function ecrireTexte(texte: string, x: number, y: number, taille: number): void {
        if (!initialized) {
            return
        }
        dessinerTexte(texte, x, y, Math.max(1, Math.min(4, taille)))
    }

    //% block="Dessiner cadre x %x y %y largeur %w hauteur %h épaisseur %e"
    //% x.defl=0 y.defl=0 w.defl=20 h.defl=20 e.defl=1
    export function dessinerCadre(x: number, y: number, w: number, h: number, e: number): void {
        if (!initialized) {
            return
        }
        for (let k = 0; k < e; k++) {
            for (let i = 0; i < w; i++) {
                setPixel(x + i, y + k)
                setPixel(x + i, y + h - 1 - k)
            }
            for (let j = 0; j < h; j++) {
                setPixel(x + k, y + j)
                setPixel(x + w - 1 - k, y + j)
            }
        }
    }

    //% blockHidden=true
    export function dessinerImage(data: Buffer, x: number, y: number): void {
        if (!initialized || data.length != 128) {
            return
        }
        if (x < 0 || x > WIDTH - 32 || y < 0 || y > COLS - 32) {
            return
        }
        const pageHaute = 15 - (x >> 3)
        for (let p = 0; p < 4; p++) {
            buffer.write((pageHaute - p) * COLS + y, data.slice(p * 32, 32))
        }
    }

    //% blockHidden=true
    export function dessinerEcran(data: Buffer): void {
        if (!initialized || data.length != PAGES * COLS) {
            return
        }
        buffer.write(0, data)
    }

    //% blockHidden=true
    export function afficherEcran(data: Buffer): void {
        if (!initialized || data.length != PAGES * COLS) {
            return
        }
        buffer.write(0, data)
        rafraichir()
    }

}
