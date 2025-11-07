export default function Test() {
  return (
    <div id="test-data">
      <p>
        <b>Альфа версия все еще будут правки чуть позже!!!!!!</b>
      </p>
      <p>
        сылка на github:{" "}
        <a href="https://github.com/xim01/test_tan" target="_blank">
          https://github.com/xim01/test_tan
        </a>
      </p>
      {/*  */}
      <p>
        <b>Нормальный сценарий</b>
      </p>
      <p>- Email: user@example.com</p>
      {/*  */}
      <p>
        <b>Без 2FA аунтификация</b>
      </p>
      <p>- Email: user@example.com</p>
      {/*  */}
      <p>
        <b>Аккаунт заблокирыван</b>
      </p>
      <p>- Email: locked@account.com</p>
      <p>
        <b>Email не подтвержден</b>
      </p>
      <p>- Email: unverified@email.com</p>

      <br />
      <p>- Пароль: 123456</p>
      <p>- Код 2FA: 123456</p>
    </div>
  );
}
