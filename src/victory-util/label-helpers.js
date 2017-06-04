import Helpers from "./helpers";

export default {
  getText(props, datum, index) {
    if (datum.label !== undefined) {
      return datum.label;
    }
    return Array.isArray(props.labels) ? props.labels[index] : props.labels;
  },

  getVerticalAnchor(props, datum) {
    const sign = datum._y >= 0 ? 1 : -1;
    const labelStyle = props.style && props.style.labels || {};
    if (datum.getVerticalAnchor || labelStyle.verticalAnchor) {
      return datum.getVerticalAnchor || labelStyle.verticalAnchor;
    } else if (!props.horizontal) {
      return sign >= 0 ? "end" : "start";
    } else {
      return "middle";
    }
  },

  getTextAnchor(props, datum) {
    const { style, horizontal } = props;
    const sign = datum._y >= 0 ? 1 : -1;
    const labelStyle = style && style.labels || {};
    if (datum.getVerticalAnchor || labelStyle.verticalAnchor) {
      return datum.getVerticalAnchor || labelStyle.verticalAnchor;
    } else if (!horizontal) {
      return "middle";
    } else {
      return sign >= 0 ? "start" : "end";
    }
  },

  getAngle(props, datum) {
    const labelStyle = props.style && props.style.labels || {};
    return datum.angle || labelStyle.angle;
  },

  getPadding(props, datum) {
    const { horizontal, style } = props;
    const labelStyle = style.labels || {};
    const defaultPadding = labelStyle.padding || 0;
    const sign = datum._y < 0 ? -1 : 1;
    return {
      x: horizontal ? sign * defaultPadding : 0,
      y: horizontal ? 0 : sign * defaultPadding
    };
  },

  getPosition(props, datum) {
    const { horizontal } = props;
    const { x, y } = Helpers.scalePoint(props, datum);
    const padding = this.getPadding(props, datum);
    return {
      x: horizontal ? y + padding.x : x + padding.x,
      y: horizontal ? x + padding.y : y - padding.y
    };
  },

  getTextAngle(props, baseAngle) {
    if (props.labelPlacement === "vertical") {
      return 0;
    }
    const degrees = this.radiansToDegrees(baseAngle);
    const sign = (degrees > 90 && degrees < 180 || degrees > 270) ? 1 : -1;
    let angle;
    if (degrees === 0 || degrees === 180) {
      angle = 90;
    } else if (degrees > 0 && degrees < 180) {
      angle = 90 - degrees;
    } else if (degrees > 180 && degrees < 360) {
      angle = 270 - degrees;
    }
    const labelRotation = props.labelPlacement === "perpendicular" ? 0 : 90;
    return angle + sign * labelRotation;
  },

  getPolarTextAnchor(baseAngle, labelPlacement) {
    if (labelPlacement === "perpendicular") {
      return "middle";
    }
    const angle = this.radiansToDegrees(baseAngle);
    return angle <= 90 || angle > 270 ? "start" : "end";
  },

  getProps(props, index) {
    const { scale, data, style, horizontal } = props;
    const datum = data[index];
    const textAnchor = this.getTextAnchor(props, datum);
    const verticalAnchor = this.getVerticalAnchor(props, datum);
    const angle = this.getAngle(props, datum);
    const text = this.getText(props, datum, index);
    const { x, y } = this.getPosition(props, datum);
    return {
      style: style.labels,
      x, y,
      text,
      index,
      scale,
      datum,
      data,
      textAnchor,
      verticalAnchor,
      angle,
      horizontal
    };
  }
};