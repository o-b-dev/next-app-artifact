import type { RunnerOptions } from 'react-runner'

export const demoTxt: RunnerOptions = {
  code: `
        import React, { useState } from 'react';
        import { Button } from '@workspace/ui';

        const LoginForm: React.FC = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          // 这里可以添加登录逻辑
          console.log('Login attempt with:', { username, password });
        };

        return (
          <div className="flex min-h-[70vh] items-center justify-center bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold mb-6 text-center text-black">用户登录</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="请输入用户名"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    密码
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="请输入密码"
                    required
                  />
                </div>
                <Button
                  type="submit"
                >
                  登录
                </Button>
              </form>
              <div className="mt-4 text-center">
                <a href="#" className="text-blue-500 hover:underline text-sm">
                  忘记密码？
                </a>
              </div>
            </div>
          </div>
        );
        };

        export default LoginForm;
        `
}
