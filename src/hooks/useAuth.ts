import axios from "axios";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

import { User } from "../types/api/user";
import { useMessage } from "./useMessage";
import { useLoginUser } from "../hooks/useLoginUser";

export const useAuth = () => {
  const history = useHistory();
  const { showMessage } = useMessage();
  const { setLoginUser } = useLoginUser();

  const [loading, setLoading] = useState(false);

  const login = useCallback(
    (id: string) => {
      setLoading(true);

      axios
        .get<User>(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then((res) => {
          if (res.data) {
            // contextにログインユーザーの情報を保存
            // サンプル的にidが10のユーザーを管理者としてみる
            const isAdmin = res.data.id === 10 ? true : false;
            setLoginUser({ ...res.data, isAdmin });
            showMessage({ title: "ログインしました。", status: "success" });
            history.push("/home");
          } else {
            showMessage({
              title: "ユーザーが見つかりません。",
              status: "error"
            });
            setLoading(false);
          }
        })
        .catch(() => {
          showMessage({ title: "ログインできません。", status: "warning" });
          setLoading(false);
        });
    },
    [history, showMessage, setLoginUser]
  );
  return { login };
};
