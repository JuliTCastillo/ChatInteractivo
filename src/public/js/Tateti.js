export class Tateti {
    constructor(nombre) {
        this.players = []; //Estructura -> {user, symbol}
        this.board = Array(9).fill("");
        this.turn = null;
        this.status = "waiting"; // 'waiting' | 'playing' | 'finished'
    }

    getPlayerById(id) {
        return this.players.find(p => p.id === id);
    }


    //Validamos si tenemos dos jugadores
    addPlayer(socketId, username) {
        if (this.players.length >= 2) return false;
        //Asignamos los simbolos
        const symbol = this.players.length === 0 ? "X" : "O";
        //agregamos a la lista de jugadores
        this.players.push({ id: socketId, username, symbol });

        //Asignamos el valor al segundo jugador y cambiamos el estado del juego
        if (this.players.length === 2) {
            this.turn = "X";
            this.status = "playing";
        }

        return true;
    }

    //Validamos que la partida esta llena
    isFull() {
        return this.players.length >= 2;
    }

    makeMove(socketId, pos) {
        //Validar si el juego ya comenzó
        if (this.status !== "playing")
            return { ok: false, reason: "Aún no se puede jugar" };

        //Validar que la posición sea válida (0 a 8)
        if (pos < 0 || pos > 8)
            return { ok: false, reason: "Posición inválida" };

        //Obtener el jugador que está intentando jugar
        const player = this.getPlayerById(socketId);

        // Si no está en la partida
        if (!player)
            return { ok: false, reason: "No estás en la partida" };

        //Verificar turno correcto
        if (player.symbol !== this.turn) {
            return { ok: false, reason: "No es tu turno" };
        }

        //Verificar que la celda no esté ocupada
        if (this.board[pos] !== "") {
            return { ok: false, reason: "La celda ya está ocupada" };
        }

        //Realizar la jugada
        this.board[pos] = player.symbol;

        //Cambiar el turno al otro jugador
        this.turn = this.turn === "X" ? "O" : "X";

        //Acá podés checkear ganador o empate antes de devolver ok
        return { ok: true };
    }

}