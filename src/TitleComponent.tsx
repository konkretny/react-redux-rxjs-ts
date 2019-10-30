import React from "react";
import { connect } from "react-redux";

const TitleComponent = (props: any) => {
  const { title } = props;

  return (
    <div>
      <div>Title: {title}</div>
    </div>
  );
};

//gets title state from store
const mapStateToProps = (state: any) => {
  return { title: state.title };
};
//connector
export default connect(mapStateToProps)(TitleComponent);
