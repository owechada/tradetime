import { Router } from "express";
import {
  getCurrencypairs,
  geTradeSignalController,
  getStablePairsController,
  getTradeStrategy,
  getIndicatorOptions,
  getForexStrategy,
  getCryptoStrategy,
  getGoldStrategy,
  getIndicesStrategy,
} from "../controllers/genController";
import { GetTadeStrategy } from "../generations/currencypairs";
const genrouter = Router();

genrouter.post("/getcurrencypair", getCurrencypairs);
genrouter.post("/getstable", getStablePairsController);
genrouter.post("/gettradesignal", geTradeSignalController);
genrouter.post("/genstrategy", getTradeStrategy);
genrouter.post("/genstrategy/options", getIndicatorOptions);
genrouter.post("/genstrategy/forex", getForexStrategy);
genrouter.post("/genstrategy/crypto", getCryptoStrategy);
genrouter.post("/genstrategy/gold", getGoldStrategy);
genrouter.post("/genstrategy/indices", getIndicesStrategy);
export default genrouter;
