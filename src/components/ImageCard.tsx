import * as React from "react";
import * as _ from "lodash";

const ImageCard = (props: any) => {
  const [lowResImageLoaded, setLowResImageLoaded] = React.useState(false);
  const [highResImageLoaded, setHighResImageLoaded] = React.useState(false);

  return (
    <div className={"image-card"}>
      <div
        className={"image-placeholder"}
        style={{
          backgroundColor: _.get(props, "color"),
          display: lowResImageLoaded || highResImageLoaded ? "none" : "inherit",
        }}
      />
      <img
        src={_.get(props, "urls.thumb")}
        className={"image"}
        style={{
          display:
            !lowResImageLoaded || highResImageLoaded ? "none" : "inherit",
        }}
        alt={_.get(props, "alt_description")}
        onLoad={() => setLowResImageLoaded(true)}
      />
      <img
        src={_.get(props, "urls.regular")}
        className={"image"}
        style={{
          display: !highResImageLoaded ? "none" : "inherit",
        }}
        alt={_.get(props, "alt_description")}
        onLoad={() => setHighResImageLoaded(true)}
      />
      {_.size(_.get(props, "tags")) > 0 ? (
        <div className={"image-metadata"}>
          {_.map(_.get(props, "tags"), (tag: any, index: number) => {
            return (
              <span className={"image-tag"} key={index}>
                {_.get(tag, "title")}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ImageCard;
