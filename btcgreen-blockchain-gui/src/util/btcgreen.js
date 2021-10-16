const Big = require('big.js');
const units = require('./units');

// TODO: use bigint instead of float
const convert = (amount, from, to) => {
  if (Number.isNaN(Number.parseFloat(amount)) || !Number.isFinite(amount)) {
    return 0;
  }

  const amountInFromUnit = Big(amount).times(units.getUnit(from));

  return Number.parseFloat(amountInFromUnit.div(units.getUnit(to)));
};

class BTCgreen {
  constructor(value, unit) {
    this._value = value;
    this._unit = unit;
  }

  to(newUnit) {
    this._value = convert(this._value, this._unit, newUnit);
    this._unit = newUnit;

    return this;
  }

  value() {
    return this._value;
  }

  format() {
    const displayUnit = units.getDisplay(this._unit);

    const { format, fractionDigits, trailing } = displayUnit;

    let options = { maximumFractionDigits: fractionDigits };

    if (trailing) {
      options = { minimumFractionDigits: fractionDigits };
    }

    let value;

    if (fractionDigits !== undefined) {
      const fractionPower = Big(10).pow(fractionDigits);
      value = Number.parseFloat(
        Big(Math.floor(Big(this._value).times(fractionPower))).div(
          fractionPower,
        ),
      );
    } else {
      value = this._value;
    }

    let formatted = format.replace(
      '{amount}',
      Number.parseFloat(value).toLocaleString(undefined, options),
    );

    if (displayUnit.pluralize && this._value !== 1) {
      formatted += 's';
    }

    return formatted;
  }

  toString() {
    const displayUnit = units.getDisplay(this._unit);
    const { fractionDigits } = displayUnit;
    const options = { maximumFractionDigits: fractionDigits };
    return Number.parseFloat(this._value).toLocaleString(undefined, options);
  }
}

export const btcgreen_formatter = (value, unit) => new BTCgreen(value, unit);

btcgreen_formatter.convert = convert;
btcgreen_formatter.setDisplay = units.setDisplay;
btcgreen_formatter.setUnit = units.setUnit;
btcgreen_formatter.getUnit = units.getUnit;
btcgreen_formatter.setFiat = (currency, rate, display = null) => {
  units.setUnit(currency, 1 / rate, display);
};

export const byte_to_btcgreen = (byte) => {
  return btcgreen_formatter(Number.parseInt(byte), 'byte').to('btcgreen').value();
};

export const btcgreen_to_byte = (btcgreen) => {
  return btcgreen_formatter(Number.parseFloat(Number(btcgreen)), 'btcgreen')
    .to('byte')
    .value();
};

export const byte_to_btcgreen_string = (byte) => {
  return btcgreen_formatter(Number(byte), 'byte').to('btcgreen').toString();
};

export const byte_to_colouredcoin = (byte) => {
  return btcgreen_formatter(Number.parseInt(byte), 'byte')
    .to('colouredcoin')
    .value();
};

export const colouredcoin_to_byte = (colouredcoin) => {
  return btcgreen_formatter(Number.parseFloat(Number(colouredcoin)), 'colouredcoin')
    .to('byte')
    .value();
};

export const byte_to_colouredcoin_string = (byte) => {
  return btcgreen_formatter(Number(byte), 'byte').to('colouredcoin').toString();
};
