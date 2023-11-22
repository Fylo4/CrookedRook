import { Injectable } from '@angular/core';
import { ccit_blackroot } from 'src/assets/boards/CCIT/Blackroot';
import { ccit_bony_yet_blessed } from 'src/assets/boards/CCIT/Bony Yet Blessed';
import { ccit_cannon } from 'src/assets/boards/CCIT/Cannon';
import { ccit_chesscraft_trailer } from 'src/assets/boards/CCIT/Chesscraft Trailer';
import { ccit_crow_chess } from 'src/assets/boards/CCIT/Crow Chess';
import { ccit_honey_rush } from 'src/assets/boards/CCIT/Honey Rush';
import { ccit_kitchen } from 'src/assets/boards/CCIT/Kitchen';
import { ccit_leapy_makruk } from 'src/assets/boards/CCIT/LeapyMakruk';
import { ccit_no_step_on_snek } from 'src/assets/boards/CCIT/No Step On Snek';
import { ccit_omega_chess_extreme } from 'src/assets/boards/CCIT/Omega Chess Extreme';
import { ccit_segiztas_peak } from 'src/assets/boards/CCIT/Segiztas Peak';
import { ccit_ultimate_chess } from 'src/assets/boards/CCIT/Ultimate Chess';
import { chess_atomic } from 'src/assets/boards/Chess/Atomic Chess';
import { chess_berolina } from 'src/assets/boards/Chess/Berolina Chess';
import { chess_on_a_really_big_board } from 'src/assets/boards/Chess/Chess_on_a_Really_Big_Board';
import { chess_crazyhouse } from 'src/assets/boards/Chess/Crazyhouse';
import { chess_horde } from 'src/assets/boards/Chess/Horde_Chess';
import { chess_koth } from 'src/assets/boards/Chess/King of the Hill';
import { chess_knightmate } from 'src/assets/boards/Chess/Knightmate';
import { chess_los_alamos } from 'src/assets/boards/Chess/Los Alamos';
import { chess_maharajah } from 'src/assets/boards/Chess/Maharajah';
import { chess_marseillais } from 'src/assets/boards/Chess/Marseillais Chess';
import { chess_monster } from 'src/assets/boards/Chess/Monster Chess';
import { chess_omega } from 'src/assets/boards/Chess/Omega Chess';
import { chess_pocket_knight } from 'src/assets/boards/Chess/Pocket Knight Chess';
import { chess_spartan } from 'src/assets/boards/Chess/Spartan Chess';
import { chess_wildebeest } from 'src/assets/boards/Chess/Wildebeest Chess';
import { chess } from 'src/assets/boards/Chess/chess';
import { chess_5040 } from 'src/assets/boards/Chess/chess5040';
import { compound_almost } from 'src/assets/boards/Compound Chess/Almost Chess';
import { compound_bird } from 'src/assets/boards/Compound Chess/Bird\'s Chess';
import { compound_capablanca } from 'src/assets/boards/Compound Chess/Capablanca Chess';
import { compound_carrera } from 'src/assets/boards/Compound Chess/Carrera\'s Chess';
import { compound_shuffle } from 'src/assets/boards/Compound Chess/Compound Shuffle Chess';
import { compound_embassy } from 'src/assets/boards/Compound Chess/Embassy Chess';
import { compound_gothic } from 'src/assets/boards/Compound Chess/Gothic Chess';
import { compound_grand } from 'src/assets/boards/Compound Chess/Grand Chess';
import { compound_shogun } from 'src/assets/boards/Compound Chess/Shogun Chess';
import { hist_chatur } from 'src/assets/boards/Historical/Chaturanga';
import { hist_courier } from 'src/assets/boards/Historical/Courier Chess';
import { hist_courier_start } from 'src/assets/boards/Historical/Courier Chess Start';
import { hist_grant } from 'src/assets/boards/Historical/Grant Acedrex';
import { other_congo } from 'src/assets/boards/Other/Congo';
import { other_dragonfly } from 'src/assets/boards/Other/Dragonfly';
import { other_metamachy } from 'src/assets/boards/Other/Metamachy';
import { other_shako } from 'src/assets/boards/Other/Shako';
import { other_checkers } from 'src/assets/boards/Other/checkers';
import { sea_asean } from 'src/assets/boards/SEA/Asean Chess';
import { sea_main_chator } from 'src/assets/boards/SEA/Main Chator';
import { sea_makruk } from 'src/assets/boards/SEA/Makruk';
import { sea_ouk_chaktrang } from 'src/assets/boards/SEA/Ouk Chaktrang';
import { sea_sittuyin } from 'src/assets/boards/SEA/Sittuyin';
import { shogi_dobutsu } from 'src/assets/boards/Shogi/Dobutsu';
import { shogi_euro } from 'src/assets/boards/Shogi/Euro Shogi';
import { shogi_goro_goro } from 'src/assets/boards/Shogi/Goro-Goro Shogi';
import { shogi_heian } from 'src/assets/boards/Shogi/Heian Shogi';
import { shogi_judkins } from 'src/assets/boards/Shogi/Judkins Shogi';
import { shogi_kyoto } from 'src/assets/boards/Shogi/Kyoto Shogi';
import { shogi_micro } from 'src/assets/boards/Shogi/Micro Shogi';
import { shogi_mini } from 'src/assets/boards/Shogi/Mini Shogi';
import { shogi_rocket } from 'src/assets/boards/Shogi/Rocket Shogi';
import { shogi_sho } from 'src/assets/boards/Shogi/Sho Shogi';
import { shogi_simple } from 'src/assets/boards/Shogi/Simple Shogi';
import { shogi_tori } from 'src/assets/boards/Shogi/Tori Shogi';
import { shogi_wa } from 'src/assets/boards/Shogi/Wa Shogi';
import { shogi_yari } from 'src/assets/boards/Shogi/Yari Shogi';
import { shogi } from 'src/assets/boards/Shogi/shogi';
import { xiangqi_5_tigers } from 'src/assets/boards/Xiangqi/5 Tigers';
import { xiangqi_ajax } from 'src/assets/boards/Xiangqi/Ajax Xiangqi';
import { xiangqi_janggi } from 'src/assets/boards/Xiangqi/Janggi';
import { xiangqi_manchu } from 'src/assets/boards/Xiangqi/Manchu Chess';
import { xiangqi_mini } from 'src/assets/boards/Xiangqi/MiniXiangqi';
import { xiangqi_sanho } from 'src/assets/boards/Xiangqi/Sanho';
import { xiangqi } from 'src/assets/boards/Xiangqi/Xiangqi';

@Injectable({
  providedIn: 'root'
})
export class BoardLoadingService {

  constructor() { }
  boards: BoardListing[] = [
    {category: 'chess', name: 'Chess', value: chess},
    {category: 'chess', name: 'Atomic Chess', value: chess_atomic},
    {category: 'chess', name: 'Berolina Chess', value: chess_berolina},
    {category: 'chess', name: 'Chess on a Really Big Board', value: chess_on_a_really_big_board},
    {category: 'chess', name: 'Chess5040', value: chess_5040},
    {category: 'chess', name: 'Crazyhouse', value: chess_crazyhouse},
    {category: 'chess', name: 'Horde Chess', value: chess_horde},
    {category: 'chess', name: 'King of the Hill', value: chess_koth},
    {category: 'chess', name: 'Knightmate', value: chess_knightmate},
    {category: 'chess', name: 'Los Alamos Chess', value: chess_los_alamos},
    {category: 'chess', name: 'Maharajah', value: chess_maharajah},
    {category: 'chess', name: 'Marseillais Chess', value: chess_marseillais},
    {category: 'chess', name: 'Monster Chess', value: chess_monster},
    {category: 'chess', name: 'Omega Chess', value: chess_omega},
    {category: 'chess', name: 'Pocket Knight Chess', value: chess_pocket_knight},
    {category: 'chess', name: 'Spartan Chess', value: chess_spartan},
    {category: 'chess', name: 'Wildebeest Chess', value: chess_wildebeest},
    
    {category: 'CCIT', name: 'Crow Chess', value: ccit_crow_chess},
    {category: 'CCIT', name: 'Cannon :>', value: ccit_cannon},
    {category: 'CCIT', name: 'No Step On Snek', value: ccit_no_step_on_snek},
    {category: 'CCIT', name: 'Kitchen', value: ccit_kitchen},
    {category: 'CCIT', name: 'LeapyMakruk', value: ccit_leapy_makruk},
    {category: 'CCIT', name: 'Honey Rush', value: ccit_honey_rush},
    {category: 'CCIT', name: 'Segiztas Peak', value: ccit_segiztas_peak},
    {category: 'CCIT', name: 'Blackroot', value: ccit_blackroot},
    {category: 'CCIT', name: 'Ultimate Chess', value: ccit_ultimate_chess},
    {category: 'CCIT', name: 'Chesscraft Trailer', value: ccit_chesscraft_trailer},
    {category: 'CCIT', name: 'Omega Chess Extreme', value: ccit_omega_chess_extreme},
    {category: 'CCIT', name: 'Bony yet Blessed', value: ccit_bony_yet_blessed},
    
    {category: 'compound', name: 'Almost Chess', value: compound_almost},
    {category: 'compound', name: 'Bird\'s Chess', value: compound_bird},
    {category: 'compound', name: 'Capablanca Chess', value: compound_capablanca},
    {category: 'compound', name: 'Carrera\'s Chess', value: compound_carrera},
    {category: 'compound', name: 'Compound Shuffle Chess', value: compound_shuffle},
    {category: 'compound', name: 'Embassy Chess', value: compound_embassy},
    {category: 'compound', name: 'Gothic Chess', value: compound_gothic},
    {category: 'compound', name: 'Grand Chess', value: compound_grand},
    {category: 'compound', name: 'Shogun Chess', value: compound_shogun},
    
    {category: 'historical', name: 'Chaturanga', value: hist_chatur},
    {category: 'historical', name: 'Courier Chess', value: hist_courier},
    {category: 'historical', name: 'Courier Chess (Starting Moves)', value: hist_courier_start},
    {category: 'historical', name: 'Grant Acedrex', value: hist_grant},
    
    {category: 'SEA', name: 'Makruk', value: sea_makruk},
    {category: 'SEA', name: 'Ouk Chaktrang', value: sea_ouk_chaktrang},
    {category: 'SEA', name: 'Sittuyin', value: sea_sittuyin},
    {category: 'SEA', name: 'Main Chator', value: sea_main_chator},
    {category: 'SEA', name: 'Asean Chess', value: sea_asean},
    
    {category: 'shogi', name: 'Shogi', value: shogi},
    {category: 'shogi', name: 'Dobutsu Shogi', value: shogi_dobutsu},
    {category: 'shogi', name: 'Simple Shogi', value: shogi_simple},
    {category: 'shogi', name: 'Micro Shogi', value: shogi_micro},
    {category: 'shogi', name: 'Mini Shogi', value: shogi_mini},
    {category: 'shogi', name: 'Kyoto Shogi', value: shogi_kyoto},
    {category: 'shogi', name: 'Goro-Goro Shogi', value: shogi_goro_goro},
    {category: 'shogi', name: 'Rocket Shogi', value: shogi_rocket},
    {category: 'shogi', name: 'Judkins Shogi', value: shogi_judkins},
    {category: 'shogi', name: 'Tori Shogi', value: shogi_tori},
    {category: 'shogi', name: 'Yari Shogi', value: shogi_yari},
    {category: 'shogi', name: 'Euro Shogi', value: shogi_euro},
    {category: 'shogi', name: 'Heian Shogi', value: shogi_heian},
    {category: 'shogi', name: 'Sho Shogi', value: shogi_sho},
    {category: 'shogi', name: 'Wa Shogi', value: shogi_wa},
    
    {category: 'xiangqi', name: 'Xiangqi', value: xiangqi},
    {category: 'xiangqi', name: 'Janggi', value: xiangqi_janggi},
    {category: 'xiangqi', name: 'MiniXiangqi', value: xiangqi_mini},
    {category: 'xiangqi', name: 'Manchu Chess', value: xiangqi_manchu},
    {category: 'xiangqi', name: '5 Tigers', value: xiangqi_5_tigers},
    {category: 'xiangqi', name: 'Ajax Tigers', value: xiangqi_ajax},
    {category: 'xiangqi', name: 'Sanho', value: xiangqi_sanho},
    
    {category: 'other', name: 'Congo', value: other_congo},
    {category: 'other', name: 'Dragonfly', value: other_dragonfly},
    {category: 'other', name: 'Metamachy', value: other_metamachy},
    {category: 'other', name: 'Shako', value: other_shako},
    {category: 'other', name: 'Checkers', value: other_checkers},
  ]

  getCategory(category: string) {
    return this.boards.filter(b => b.category === category);
  }

  getFromName(name: string) {
    return this.boards.find(b => b.name.toLowerCase() === name.toLowerCase());
  }

  getRandomBoard() {
    return this.boards[Math.floor(Math.random()*this.boards.length)];
  }
}

interface BoardListing {
  category: string,
  name: string,
  value: any
}