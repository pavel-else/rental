// ТРЕБОВАНИЯ
// модуль предоставляет функционал для работы с временем

// функция принимает формат и опционально время
// time('d.m.y', '2019-02-01')
// возращает отформатированное время

import moment from 'moment';

moment.lang('ru');

const format = (format, date) => {
    return moment().format(format, date);
};

export { format };
