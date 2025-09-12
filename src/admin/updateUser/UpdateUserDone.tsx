import styles from "./UpdateUser.module.css";

export function UpdateUserDone() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        Thanks for registering!
        <br />
        Please return the device to the person that handed it to you and wait for good news!
      </div>
    </div>
  );
}
