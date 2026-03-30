# Trading Bot Agent

> Automated BTC RSI Turtle strategy for systematic crypto trading.

## Overview

An AI-powered trading agent implementing the proven Turtle RSI strategy for Bitcoin on 4-hour timeframes. Eliminates emotional decision-making with predefined entry/exit rules.

## Features

- **Automated RSI Entry/Exit** — Entry at RSI 74, Exit at RSI 24 (golden reference)
- **Real-time Market Monitoring** — Continuous BTC price tracking
- **Risk Management** — Position sizing, stop-loss, drawdown limits
- **Performance Analytics** — Dashboard with P&L, win rate, Sharpe ratio
- **Multi-timeframe Analysis** — Confirms signals across H1, H4, D1

## Installation

```bash
# Clone the skill package
git clone https://github.com/syncoe/trading-bot.git
cd trading-bot/scripts
chmod +x main.sh
```

## Usage

```bash
# Start the trading bot
./scripts/main.sh --pair BTC/USDT --timeframe 4h

# Backtest with historical data
./scripts/main.sh --backtest --days 90
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `RSI_ENTRY` | RSI threshold for entry | 74 |
| `RSI_EXIT` | RSI threshold for exit | 24 |
| `POSITION_SIZE` | Position size in USD | 100 |
| `STOP_LOSS_PCT` | Stop loss percentage | 5.0 |
| `EXCHANGE_API_KEY` | Exchange API key | — |

## License

MIT
