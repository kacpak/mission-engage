import styles from "./UpdateUser.module.css";
import { useNavigate } from "react-router";

export function UpdateUserDone() {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        Thanks for registering!
        <br />
        Please return the device to the person that handed it to you and wait for good news!
      </div>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        Go back to overview
      </button>
    </div>
  );
}
