using System.Collections.Generic;

namespace JogoDaVeia.Models
{
    public class Sala
    {
        public int Id { get; set; }
        public List<Jogador> Jogadores { get; set; }
        public bool Fechada { get { return Jogadores.Count >= 2; }}

        public Sala()
        {
            Jogadores = new List<Jogador>();
        }
    }
}